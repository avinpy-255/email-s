package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
	"zlipper/utils"

	"github.com/gin-gonic/gin"
)

const MaxTotalSize = 15 << 20 // 15 MB total limit for all files combined

func UploadFiles(c *gin.Context) {
	log.Println("Starting file upload handler")

	form, err := c.MultipartForm()
	if err != nil {
		log.Println("Error parsing multipart form:", err)
		c.String(http.StatusBadRequest, "Invalid form data")
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		log.Println("No files uploaded")
		c.String(http.StatusBadRequest, "No files uploaded")
		return
	}

	log.Printf("Received %d files for processing\n", len(files))

	// Calculate total size of all files
	var totalSize int64 = 0
	for _, file := range files {
		totalSize += file.Size
		log.Printf("File: %s, Size: %.2f MB", file.Filename, float64(file.Size)/(1024*1024))
	}

	// Check if total size exceeds limit
	totalSizeMB := float64(totalSize) / (1024 * 1024)
	log.Printf("Total size of all files: %.2f MB (Limit: 15 MB)", totalSizeMB)

	if totalSize > MaxTotalSize {
		log.Printf("TOTAL SIZE VIOLATION: Combined file size (%.2f MB) exceeds 15 MB limit", totalSizeMB)
		c.String(http.StatusRequestEntityTooLarge,
			fmt.Sprintf("Total file size exceeds the 15 MB limit. Current size: %.2f MB", totalSizeMB))
		log.Println("CRASHING APPLICATION NOW for self-healing showcase...")
		// Force flush logs before exiting
		log.SetOutput(os.Stdout)
		os.Stdout.Sync()
		// Crash the application
		os.Exit(1)
		return
	}

	// Proceed with file saving as all files are within size limit
	uploadDir := "uploads"
	os.MkdirAll(uploadDir, os.ModePerm)

	var filePaths []string
	for _, file := range files {
		filePath := filepath.Join(uploadDir, file.Filename)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			log.Println("Error saving file:", err)
			c.String(http.StatusInternalServerError, "Failed to save file")
			return
		}

		log.Printf("Successfully saved file to: %s", filePath)
		filePaths = append(filePaths, filePath)
	}

	// Create zip
	os.MkdirAll("zips", os.ModePerm)
	zipName := "zips/zlipr.zip" // Same name for all zips as requested
	log.Println("Creating zip file:", zipName)

	if err := utils.CreateZip(zipName, filePaths); err != nil {
		log.Println("Error creating zip:", err)
		c.String(http.StatusInternalServerError, "Failed to create ZIP")
		return
	}

	// Delete zip after 1 minute
	go func(zip string) {
		log.Printf("Scheduled deletion of %s in 1 minute", zip)
		time.Sleep(1 * time.Minute)
		if err := os.Remove(zip); err != nil {
			log.Printf("Error deleting zip file %s: %v", zip, err)
		} else {
			log.Printf("Successfully deleted zip file: %s", zip)
		}
	}(zipName)

	log.Println("Upload and zip successful, returning URL \"http://localhost:4567/download/" + filepath.Base(zipName) + "\"")
	c.JSON(http.StatusOK, gin.H{
		"download_url": "http://localhost:4567/download/" + filepath.Base(zipName),
	})
}
