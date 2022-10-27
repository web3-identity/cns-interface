interface SingleJob {
  type: 'single';
  triggerTime: number;
  callback: VoidFunction;
}

interface QuantumTimeJob {
  type: 'quantumTime';
  triggerTime: [number, number];
  callback: [VoidFunction, VoidFunction];
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
    this.jobs.push(newJob);
  };

  removeJob = (index: number) => {
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
          this.removeJob(i);
        }
      } else {
        const startTime = job.triggerTime[0];
        const endTime = job.triggerTime[1];
        const startCallback = job.callback[0];
        const endCallback = job.callback[1];

        if (now >= endTime) {
          startCallback();
          this.removeJob(i);
          break;
        } else if (now >= startTime && now < endTime) {
          endCallback();
        }
      }
    }
  };
}

export default new JobSchedule();
