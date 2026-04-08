import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly coupleNames = "Purushottam Wed's Lina";
  protected readonly weddingDate = new Date('2026-04-24T18:30:00+05:30');
  protected readonly haldiDate = new Date('2026-04-23T18:30:00+05:30');
  protected readonly weddingVenue = 'The Marigold Courtyard, Jaipur';

  protected readonly countdown = signal({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  protected readonly showCountdown = signal(false);
  protected readonly sparkArray = Array.from({ length: 8 });
  protected readonly crackerBursts = signal(this.makeCrackers());

  private timerId?: ReturnType<typeof setInterval>;
  private loaderTimeoutId?: ReturnType<typeof setTimeout>;
  private crackerTimerId?: ReturnType<typeof setInterval>;
  private dropTimerId?: ReturnType<typeof setInterval>;

  protected dropX1 = 0;
  protected dropY1 = 0;
  protected dropX2 = 0;
  protected dropY2 = 0;
  protected dropX3 = 0;
  protected dropY3 = 0;

  constructor() {
    this.updateCountdown();
    this.timerId = setInterval(() => this.updateCountdown(), 1000);
    this.loaderTimeoutId = setTimeout(() => this.showCountdown.set(true), 5000);
    this.crackerTimerId = setInterval(() => {
      this.crackerBursts.set(this.makeCrackers());
    }, 2800);
    this.randomizeDrops();
    this.dropTimerId = setInterval(() => this.randomizeDrops(), 2500);
  }

  get weddingDateLabel(): string {
    return this.weddingDate.toLocaleString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get isLaunched(): boolean {
    const diff = this.weddingDate.getTime() - Date.now();
    return diff <= 0;
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    if (this.loaderTimeoutId) {
      clearTimeout(this.loaderTimeoutId);
    }
    if (this.crackerTimerId) {
      clearInterval(this.crackerTimerId);
    }
    if (this.dropTimerId) {
      clearInterval(this.dropTimerId);
    }
  }

  protected formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private updateCountdown(): void {
    const diff = Math.max(this.weddingDate.getTime() - Date.now(), 0);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.countdown.set({ days, hours, minutes, seconds });
  }

  private makeCrackers(): Array<{ x: number; y: number; scale: number; delay: number }> {
    const count = 4;
    return Array.from({ length: count }, () => ({
      x: this.rand(8, 92),
      y: this.rand(12, 82),
      scale: this.rand(0.85, 1.25),
      delay: this.rand(0, 1.6)
    }));
  }

  private rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private randomizeDrops(): void {
    this.dropX1 = this.rand(0, 80);
    this.dropY1 = this.rand(0, 80);
    this.dropX2 = this.rand(20, 100);
    this.dropY2 = this.rand(10, 90);
    this.dropX3 = this.rand(0, 100);
    this.dropY3 = this.rand(20, 100);
  }

  protected playVideo(video: HTMLVideoElement, frame?: HTMLElement): void {
    if (!video) {
      return;
    }
    if (frame) {
      frame.classList.add('is-playing');
    }
    video.play();
    video.controls = true;
  }
}
