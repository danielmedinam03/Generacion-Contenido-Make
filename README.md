## Content Generation for Social Media

This application allows users to generate marketing content for various social media platforms. It leverages AI and web scraping to tailor content to specific needs. 

### Inputs

*   **Reference URLs:** Users can provide URLs related to the content they want to generate.
*   **Prompt:** Users can input their content ideas or specific prompts for the AI.
*   **Content Type:** Users can choose the desired format (e.g., Post, Image, Video).
*   **Platforms:** Users can select the target social media platforms (e.g., Facebook, Instagram, Twitter).
*   **AI Level:** Users can adjust the AI's creativity level.
*   **Hashtags:** Users can opt to generate relevant hashtags.
*   **Reference File (Optional):** Users can upload a file for additional reference.

### Outputs

*   **Generated Content:** The AI produces text content based on the input parameters.
*   **Image (Optional):** The AI may generate an accompanying image, depending on the selected content type.
*   **Publishing:** The user can review the generated content and image, edit them if needed, and then publish directly to the chosen social media platform(s). 

### Functionality

1.  **Content Form:** Users input their desired parameters.
2.  **AI Content Generation:** The app sends the data to a webhook for processing by the AI model.
3.  **Content Display:** The generated content and image are displayed.
4.  **Publish Form:** Users can refine and publish the generated content.
5.  **Web Scraping:** A scheduled job scrapes the Morabanc website daily to update the AI's knowledge base.
6.  **Vector Database:** The scraped content is converted into vectors and stored in a Pinecone database, making it searchable for the AI. 
