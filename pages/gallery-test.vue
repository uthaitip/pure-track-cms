<template>
  <div class="test-page">
    <h1 class="page-title">ImageGallery Component Test</h1>
    
    <div class="test-section">
      <h2>Test with Sample Images</h2>
      <ImageGallery :images="sampleImages" />
    </div>
    
    <div class="test-section">
      <h2>Test with No Initial Images</h2>
      <ImageGallery :images="[]" />
    </div>
    
    <div class="instructions">
      <h3>How to test:</h3>
      <ul>
        <li>Type text in the input field</li>
        <li>Click "Choose Images" to upload your own images</li>
        <li>Hover over images to see effects</li>
        <li>Try resizing browser window for responsive design</li>
        <li>Notice odd/even layout differences</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const sampleImages = [
  {
    src: 'https://picsum.photos/400/400?random=1',
    alt: 'Sample Image 1'
  },
  {
    src: 'https://picsum.photos/400/400?random=2',
    alt: 'Sample Image 2'
  },
  {
    src: 'https://picsum.photos/400/400?random=3',
    alt: 'Sample Image 3'
  }
]
</script>

<style scoped>
.test-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.test-section {
  margin-bottom: 4rem;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.test-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.instructions {
  background: #e3f2fd;
  border: 2px solid #1976d2;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.instructions h3 {
  color: #1976d2;
  margin-bottom: 1rem;
}

.instructions ul {
  color: #333;
  margin-left: 1rem;
}

.instructions li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .test-page {
    padding: 1rem;
  }
  
  .test-section {
    padding: 1rem;
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>