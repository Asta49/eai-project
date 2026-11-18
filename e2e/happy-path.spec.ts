import { test, expect } from '@playwright/test';

test.describe('PCOS Health AI - End-to-End Happy Path', () => {
  test('Landing page loads and displays core pillars', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/N-of-1 PCOS Health Assistant/);
    await expect(page.locator('h1')).toContainText('Personal research assistant');
    await expect(page.locator('text=Open Live Demo Dashboard')).toBeVisible();
  });

  test('Dashboard displays Priya Sharma health baseline, phenotype, and active trial', async ({ page }) => {
    await page.goto('/en/dashboard');
    await expect(page.locator('text=Priya Sharma')).toBeVisible();
    await expect(page.locator('text=Phenotype B')).toBeVisible();
    await expect(page.locator('text=Ovulatory PCOS')).toBeVisible();
    await expect(page.locator('text=Morning 30-min brisk walk')).toBeVisible();
    await expect(page.locator('text=Active N-of-1 Experiment')).toBeVisible();
  });

  test('Multi-language Indic localization works for Hindi', async ({ page }) => {
    await page.goto('/hi/dashboard');
    await expect(page.locator('text=प्रिया शर्मा')).toBeVisible();
    await expect(page.locator('text=सक्रिय N-of-1 प्रयोग')).toBeVisible();
    await expect(page.locator('text=फ़िनोटाइप')).toBeVisible();
  });

  test('Deterministic Bayesian Experiment Engine displays results and Thompson recommender', async ({ page }) => {
    await page.goto('/en/experiments');
    await expect(page.locator('text=Morning 30-min brisk walk')).toBeVisible();
    await expect(page.locator('text=Low-GI Indian Diet')).toBeVisible();
    await expect(page.locator('text=Likely worked for you')).toBeVisible();
    await expect(page.locator('text=Next Experiment Recommendations (Thompson Sampling)')).toBeVisible();
    
    // Check AI explanation triggers and renders safely
    const explainBtn = page.locator('text=Explain Verdict');
    if (await explainBtn.isVisible()) {
      await explainBtn.click();
      await expect(page.locator('text=Medical Disclaimer')).toBeVisible();
    }
  });

  test('Course Presentation Moat: Network Effects & Simulation page renders', async ({ page }) => {
    await page.goto('/en/admin');
    await expect(page.locator('text=Course Presentation Moat')).toBeVisible();
    await expect(page.locator('text=Data Network Effect Simulation')).toBeVisible();
    await expect(page.locator('text=Flat Unpooled Prior')).toBeVisible();
    await expect(page.locator('text=Population Prior (Hierarchical Empirical Bayes)')).toBeVisible();
    await expect(page.locator('text=Unit Economics & Scalability')).toBeVisible();
  });

  test('Safety Disclaimer is always displayed', async ({ page }) => {
    await page.goto('/en/coach');
    await expect(page.locator('text=Medical Disclaimer')).toBeVisible();
    await expect(page.locator('text=112')).toBeVisible();
  });
});
