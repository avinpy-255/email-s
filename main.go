package main

import (
	"zlipper/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.POST("/upload", handlers.UploadFiles)
	router.Static("/download", "./zips")
	router.GET("/", func(c *gin.Context) {
		c.String(200, "Welcome to Zlipr")
	})
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	router.Run(":4567")
}
