<template>
  <div class="image-gallery">
    <!-- Input Controls -->
    <div class="input-controls">
      <div class="text-input-group">
        <label for="textInput" class="input-label">Text:</label>
        <input
          id="textInput"
          v-model="textInput"
          type="text"
          placeholder="Enter text..."
          class="text-input"
        />
      </div>
      
      <div class="image-input-group">
        <label for="imageInput" class="input-label">Add Image:</label>
        <input
          id="imageInput"
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          @change="handleImageUpload"
          class="image-input"
        />
        <button @click="triggerFileInput" class="upload-button">
          Choose Images
        </button>
      </div>
    </div>
    <div 
      v-if="isOddCount" 
      class="gallery-grid gallery-grid--odd"
    >
      <div class="first-image-container">
        <div 
          class="image-item image-item--first"
          @mouseenter="handleHover(0, true)"
          @mouseleave="handleHover(0, false)"
        >
          <img 
            :src="allImages[0].src" 
            :alt="allImages[0].alt || `Image 1`"
            class="gallery-image"
          />
        </div>
      </div>
      <div class="remaining-images-grid">
        <div 
          v-for="(image, index) in remainingImages" 
          :key="index + 1"
          class="image-item"
          @mouseenter="handleHover(index + 1, true)"
          @mouseleave="handleHover(index + 1, false)"
        >
          <img 
            :src="image.src" 
            :alt="image.alt || `Image ${index + 2}`"
            class="gallery-image"
          />
        </div>
      </div>
    </div>
    
    <div 
      v-else 
      class="gallery-grid gallery-grid--even"
    >
      <div 
        v-for="(image, index) in allImages" 
        :key="index"
        class="image-item"
        @mouseenter="handleHover(index, true)"
        @mouseleave="handleHover(index, false)"
      >
        <img 
          :src="image.src" 
          :alt="image.alt || `Image ${index + 1}`"
          class="gallery-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  }
})

const hoveredIndex = ref(null)
const textInput = ref('')
const uploadedImages = ref([])
const fileInput = ref(null)

const allImages = computed(() => [...props.images, ...uploadedImages.value])

const isOddCount = computed(() => allImages.value.length % 2 !== 0)

const remainingImages = computed(() => 
  isOddCount.value ? allImages.value.slice(1) : []
)

const handleHover = (index, isHovering) => {
  hoveredIndex.value = isHovering ? index : null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedImages.value.push({
          src: e.target.result,
          alt: file.name,
          file: file
        })
      }
      reader.readAsDataURL(file)
    }
  })
  
  event.target.value = ''
}
</script>

<style scoped>
.image-gallery {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.input-controls {
  background: #f5f5f5;
  border: 2px solid #000;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: end;
}

.text-input-group,
.image-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
  flex: 1;
}

.input-label {
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
}

.text-input {
  padding: 0.75rem;
  border: 2px solid #000;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;
}

.text-input:focus {
  outline: none;
  border-color: #333;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.image-input {
  display: none;
}

.upload-button {
  padding: 0.75rem 1.5rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.upload-button:hover {
  background: #333;
  transform: translateY(-1px);
}

.gallery-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gallery-grid--odd .first-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.gallery-grid--odd .remaining-images-grid,
.gallery-grid--even {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border: 3px solid #000;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #333;
}

.image-item--first {
  width: 100%;
  max-width: 300px;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.image-item:hover .gallery-image {
  transform: scale(1.1);
  filter: brightness(1.1);
}

@media (max-width: 768px) {
  .image-gallery {
    padding: 0.5rem;
  }
  
  .input-controls {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .text-input-group,
  .image-input-group {
    min-width: auto;
  }
  
  .gallery-grid--odd .remaining-images-grid,
  .gallery-grid--even {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .gallery-grid {
    gap: 0.75rem;
  }
  
  .image-item--first {
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .image-gallery {
    padding: 0.25rem;
  }
  
  .gallery-grid {
    gap: 0.5rem;
  }
  
  .gallery-grid--odd .remaining-images-grid,
  .gallery-grid--even {
    gap: 0.5rem;
  }
  
  .image-item--first {
    max-width: 200px;
  }
  
  .image-item {
    border-width: 2px;
  }
}
</style>