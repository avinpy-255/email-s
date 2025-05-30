package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"zlipper/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main(){
	router := gin.Default()

	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:8080,http://192.168.49.2:30080"
	}

	// Split the allowedOrigins string into a slice of strings
	originSlice := strings.Split(allowedOrigins, ",")
	// Configure CORS with the dynamic list of allowed origins
	router.Use(cors.New(cors.Config{
	 AllowOrigins:     originSlice,
	 AllowMethods:     []string{"GET", "POST", "OPTIONS"},
	 AllowHeaders:     []string{"Origin", "Content-Type", "Cache-Control", "Pragma"},
	 AllowCredentials: true,
	 MaxAge:           12 * time.Hour,
	}))

	// Routes
	router.POST("/upload", handlers.UploadFiles)

	// Serve downloadable files with download headers
	router.GET("/download/:filename", func(c *gin.Context) {
		filename := c.Param("filename")
		fullPath := "zips/" + filename

		if _, err := os.Stat(fullPath); os.IsNotExist(err) {
			c.String(http.StatusNotFound, "File not found")
			return
		}

		c.Header("Content-Description", "File Transfer")
		c.Header("Content-Disposition", "attachment; filename="+filename)
		c.Header("Content-Type", "application/octet-stream")
		c.File(fullPath)
	})

	router.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Welcome to Zlipr")
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	log.Println("Server is running on http://localhost:4567")
	router.Run(":4567")
}
