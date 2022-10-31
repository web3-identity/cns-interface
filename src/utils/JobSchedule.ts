interface SingleJob {
  key?: string;
  type: 'single';
  triggerTime: number;
  callback: VoidFunction;
}

interface QuantumTimeJob {
  key?: string;
  type: 'quantumTime';
  triggerTime: [number, number];
  callback: [VoidFunction | null, VoidFunction];
}

type Job = SingleJob | QuantumTimeJob;

class JobSchedule {
  jobs: Job[] = [];
  interval: number | null = null;

  addJob = (job: Omit<Job, 'type'>) => {
    if (this.jobs.length === 0) {
      this.startInterval();
    }
    const newJob = { ...job, type: Array.isArray(job.triggerTime) ? 'quantumTime' : 'single' } as Job;

    const sameKeyJobIndex = this.jobs.findIndex((j) => j.key === job.key);
    if (sameKeyJobIndex !== -1) {
      this.jobs[sameKeyJobIndex] = newJob;
    } else {
      this.jobs.push(newJob);
    }
  };

  removeJob = (key: string) => {
    this.jobs = this.jobs.filter((job) => job.key !== key);
    if (this.jobs.length === 0 && this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private _removeJob = (index: number) => {
    this.jobs.splice(index, 1);
    if (this.jobs.length === 0 && this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  startInterval = () => {
    if (this.interval !== null) return;
    this.interval = setInterval(this.checkJobs, 250) as unknown as number;
  };

  checkJobs = () => {
    const now = Date.now();

    for (let i = this.jobs.length - 1; i >= 0; i--) {
      const job = this.jobs[i];
      if (job.type === 'single') {
        if (now >= job.triggerTime) {
          job.callback();
          this._removeJob(i);
        }
      } else {
        const startTime = job.triggerTime[0];
        const endTime = job.triggerTime[1];
        const startCallback = job.callback[0];
        const endCallback = job.callback[1];

        if (now >= endTime) {
          endCallback();
          this._removeJob(i);
          break;
        } else if (now >= startTime && now < endTime && startCallback) {
          startCallback();
          job.callback[0] = null;
        }
      }
    }
  };
}

export default new JobSchedule();
