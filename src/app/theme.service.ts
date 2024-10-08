import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private isAccessibilityEnabled = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const themePreference = localStorage.getItem('accessibility-theme');
    this.isAccessibilityEnabled = themePreference === 'enabled';

    if (this.isAccessibilityEnabled) {
      this.renderer.addClass(document.body, 'accessibility-theme');
    }
  }

  toggleAccessibilityTheme(): void {
    this.isAccessibilityEnabled = !this.isAccessibilityEnabled;
    if (this.isAccessibilityEnabled) {
      this.renderer.addClass(document.body, 'accessibility-theme');
      localStorage.setItem('accessibility-theme', 'enabled');
    } else {
      this.renderer.removeClass(document.body, 'accessibility-theme');
      localStorage.setItem('accessibility-theme', 'disabled');
    }
  }

  isAccessibilityModeEnabled(): boolean {
    return this.isAccessibilityEnabled;
  }
}
