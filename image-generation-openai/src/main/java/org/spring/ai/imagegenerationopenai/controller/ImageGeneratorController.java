package org.spring.ai.imagegenerationopenai.controller;

import org.spring.ai.imagegenerationopenai.service.ImageGeneratorService;
import org.springframework.ai.image.ImageGeneration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/image")
public class ImageGeneratorController {

    private final ImageGeneratorService imageGeneratorService;

    public ImageGeneratorController(ImageGeneratorService imageGeneratorService) {
        this.imageGeneratorService = imageGeneratorService;
    }

    @GetMapping("/generate")
    public ImageGeneration generateImage(@RequestParam(value = "message") String message) {
        return imageGeneratorService.generateImage(message);
    }

}
