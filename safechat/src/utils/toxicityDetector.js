import * as toxicity from '@tensorflow-models/toxicity';
import * as tf from '@tensorflow/tfjs';

// Threshold for toxicity classification
const TOXICITY_THRESHOLD = 0.7;

// Categories to detect
const CATEGORIES = [
  'identity_attack',
  'insult',
  'obscene',
  'severe_toxicity',
  'sexual_explicit',
  'threat',
  'toxicity'
];

class ToxicityDetector {
  constructor() {
    this.model = null;
    this.isLoading = true;
    this.loadModel();
  }

  async loadModel() {
    try {
      console.log('Loading toxicity model...');
      this.model = await toxicity.load(TOXICITY_THRESHOLD, CATEGORIES);
      console.log('Toxicity model loaded successfully');
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading toxicity model:', error);
      this.isLoading = false;
    }
    return this.model;
  }

  async detectToxicity(text) {
    if (!this.model) {
      await this.loadModel();
    }

    if (!text || text.trim() === '') {
      return {
        isToxic: false,
        toxicityScore: 0,
        categories: {}
      };
    }

    try {
      const predictions = await this.model.classify(text);
      
      // Get the general toxicity score
      const toxicityPrediction = predictions.find(p => p.label === 'toxicity');
      const toxicityScore = toxicityPrediction ? toxicityPrediction.results[0].probabilities[1] : 0;
      
      // Check if any category exceeds the threshold
      const isToxic = predictions.some(prediction => 
        prediction.results[0].match
      );
      
      // Create a map of categories and their scores
      const categories = {};
      predictions.forEach(prediction => {
        categories[prediction.label] = prediction.results[0].probabilities[1];
      });

      return {
        isToxic,
        toxicityScore,
        categories
      };
    } catch (error) {
      console.error('Error detecting toxicity:', error);
      return {
        isToxic: false,
        toxicityScore: 0,
        categories: {}
      };
    }
  }

  async analyzeToxicityRealTime(text) {
    if (!this.model || !text) {
      return {
        toxicityScore: 0
      };
    }

    try {
      // For real-time analysis, just use the main toxicity category for performance
      const predictions = await this.model.classify(text);
      const toxicityPrediction = predictions.find(p => p.label === 'toxicity');
      const toxicityScore = toxicityPrediction ? toxicityPrediction.results[0].probabilities[1] : 0;
      
      return {
        toxicityScore
      };
    } catch (error) {
      console.error('Error in real-time toxicity analysis:', error);
      return {
        toxicityScore: 0
      };
    }
  }
}

// Create a singleton instance
const toxicityDetector = new ToxicityDetector();
export default toxicityDetector;