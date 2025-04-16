package handlers

import (
    "net/http"
    "path/filepath"
    "time"
    "os"
    "zlipper/utils"

    "github.com/gin-gonic/gin"
)

func UploadFiles(c *gin.Context) {
    form, err := c.MultipartForm()
    if err != nil {
        c.String(http.StatusBadRequest, "Invalid form data")
        return
    }

    files := form.File["files"]
    if len(files) == 0 {
        c.String(http.StatusBadRequest, "No files uploaded")
        return
    }

    uploadDir := "uploads"
    os.MkdirAll(uploadDir, os.ModePerm)

    var filePaths []string
    for _, file := range files {
        filePath := filepath.Join(uploadDir, file.Filename)
        if err := c.SaveUploadedFile(file, filePath); err != nil {
            c.String(http.StatusInternalServerError, "Failed to save file")
            return
        }
        filePaths = append(filePaths, filePath)
    }

    zipName := "zips/" + time.Now().Format("20060102150405") + ".zip"
    os.MkdirAll("zips", os.ModePerm)
    if err := utils.CreateZip(zipName, filePaths); err != nil {
        c.String(http.StatusInternalServerError, "Failed to create ZIP")
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "download_url": "/download/" + filepath.Base(zipName),
    })
}
