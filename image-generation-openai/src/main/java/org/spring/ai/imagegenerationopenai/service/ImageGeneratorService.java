package org.spring.ai.imagegenerationopenai.service;

import org.springframework.ai.image.ImageGeneration;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImageOptionsBuilder;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.stereotype.Service;

@Service
public class ImageGeneratorService {

    public final ImageModel imageModel;

    public ImageGeneratorService(ImageModel imageModel) {
        this.imageModel = imageModel;
    }

    public ImageGeneration generateImage(String userPrompt) {
        ImagePrompt imagePrompt = new ImagePrompt(userPrompt,
            ImageOptionsBuilder.builder()
                .N(1)
                .height(1024)
                .width(1792)
                .build()
            );
        return imageModel.call(imagePrompt).getResult();
    }

}
