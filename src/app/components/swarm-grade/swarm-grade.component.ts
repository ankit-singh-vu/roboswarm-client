import { Component, Input } from '@angular/core';

interface SwarmGradeData {
  p50: number;
  p99: number;
  totalRequests: number;
  totalErrors: number;
  avgResponseTime: number;
  medResponseTime: number;
}

@Component({
  selector: 'app-swarm-grade',
  templateUrl: './swarm-grade.component.html',
  styleUrls: ['./swarm-grade.component.css']
})
export class SwarmGradeComponent {
  @Input() data: SwarmGradeData;

  constructor() { }

  getScore(): string {
    if (this.hasData()) {
      const totalScore: number = this.getAvgResponseTimeScore() +
                                 this.getErrorScore() +
                                 this.getMedResponseTimeScore() +
                                 this.getP50Score() +
                                 this.getP99Score();
      if (totalScore === 0) {
        return 'F';
      } else if (totalScore < .5) {
        return 'E-';
      } else if (totalScore < 1) {
        return 'E+';
      } else if (totalScore < 1.5) {
        return 'D-';
      } else if (totalScore < 2) {
        return 'D';
      } else if (totalScore < 2.5) {
        return 'D+';
      } else if (totalScore < 3) {
        return 'C-';
      } else if (totalScore < 3.5) {
        return 'C';
      } else if (totalScore < 4) {
        return 'C+';
      } else if (totalScore < 4.5) {
        return 'B-';
      } else if (totalScore < 5) {
        return 'B';
      } else if (totalScore < 6) {
        return 'B+';
      } else if (totalScore < 7) {
        return 'A-';
      } else if (totalScore < 8) {
        return 'A';
      } else if (totalScore < 10) {
        return 'A+';
      }
    } else {
      return null;
    }
  }

  private hasData(): boolean {
    return !!(
      this.data &&
      this.data.avgResponseTime &&
      this.data.medResponseTime &&
      this.data.p50 &&
      this.data.p99 &&
      this.data.totalErrors &&
      this.data.totalRequests
    );
  }

  private getP50Score(): number {
    const time: number = (this.data && this.data.p50) ? this.data.p50 : null;
    if (time < 200) {
      return 2;
    } else if (time < 300) {
      return 1.5;
    } else if (time < 400) {
      return 1;
    } else if (time < 500) {
      return 0.5;
    } else {
      return 0;
    }
  }

  private getP99Score(): number {
    const time: number = (this.data && this.data.p99) ? this.data.p99 : null;
    if (time < 200) {
      return 2;
    } else if (time < 300) {
      return 1.5;
    } else if (time < 400) {
      return 1;
    } else if (time < 500) {
      return 0.5;
    } else {
      return 0;
    }
  }

  private getErrorScore(): number {
    const errors: number = (this.data && this.data.totalErrors) ? this.data.totalErrors : null;
    const totalRequests: number = (this.data && this.data.totalRequests) ? this.data.totalRequests : null;
    if (errors && totalRequests) {
      const errorRate: number = (errors / totalRequests) * 100;
      if (errorRate === 0) {
        return 2;
      } else if (errorRate < 0.5) {
        return 1.5;
      } else if (errorRate < 1) {
        return 1;
      } else if (errorRate < 1.5) {
        return 0.5;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  private getAvgResponseTimeScore(): number {
    const avgResponseTime: number = (this.data && this.data.avgResponseTime) ? this.data.avgResponseTime : null;
    if (avgResponseTime) {
      if (avgResponseTime < 300) {
        return 2;
      } else if (avgResponseTime < 400) {
        return 1.5;
      } else if (avgResponseTime < 500) {
        return 1;
      } else if (avgResponseTime < 600) {
        return 0.5;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  private getMedResponseTimeScore(): number {
    const medResponseTime: number = (this.data && this.data.medResponseTime) ? this.data.medResponseTime : null;
    if (medResponseTime) {
      if (medResponseTime < 200) {
        return 2;
      } else if (medResponseTime < 300) {
        return 1.5;
      } else if (medResponseTime < 400) {
        return 1;
      } else if (medResponseTime < 500) {
        return 0.5;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
}
