import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwarmService, NewMachine, NewSwarm } from '../../services/swarm.service';
import { RequestResult } from '../../services/http.service';

interface CreateSwarmForm {
  name: string;
  simulated_users: number;
  swarm_size: number;
  duration_hours: number;
  duration_minutes: number;
  swarm_region: string;
  load_test_file: File;
  host_url: string;
  spawn_rate: number;
  swarm_ui_type?: string;
}

@Component({
  selector: 'app-swarm-create',
  templateUrl: './swarm-create.component.html',
  styleUrls: ['./swarm-create.component.css']
})
export class SwarmCreateComponent {
  model: CreateSwarmForm = {
    name: '',
    simulated_users: 50,
    swarm_size: 1,
    duration_hours: 1,
    duration_minutes: 30,
    swarm_region: 'nyc3',
    load_test_file: null,
    spawn_rate: 1,
    host_url: null,
    swarm_ui_type: 'headless'
  };
  submitted = false;
  error = '';
  test_type = 'headless';

  constructor(private router: Router,
              private swarmService: SwarmService) {
  }

  async onSubmit(form) {
    this.error = '';
    if (form.valid) {
      this.submitted = true;
      this.error = '';

      try {
        // Collect the file.
        const fileElement: HTMLInputElement = document.getElementById('load_test_file') as HTMLInputElement;
        const file: File = fileElement.files[0];
        const formData: FormData = new FormData();
        formData.append('loadTestData', file, file.name);

        // Add the machines to swarm.
        const machines: NewMachine[] = [];
        for (let i = 0; i < this.model.swarm_size; i++) {
          machines.push({ region: this.model.swarm_region });
        }

        // Create the swarm.
        const swarmData: NewSwarm  = {
          name: this.model.name,
          simulated_users: this.model.simulated_users,
          machines,
          file_path: '',
          spawn_rate: this.model.spawn_rate,
          host_url: this.model.host_url,
          region: this.model.swarm_region,
          duration: (this.model.duration_hours * 60) + this.model.duration_minutes,
          swarm_ui_type: this.test_type
        };

        const result: RequestResult = await this.swarmService.createSwarm(formData, swarmData);
        if (result.statusCode === 201) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = result.data;
        }
      } catch (err) {
        this.error = 'There was an error creating your load test. Please try again.';
      }
    } else {
      this.error = 'Invalid form data. Please make sure all fields are completed.';
    }
    this.submitted = false;
  }

  allFieldsCompleted() {
    if (this.model.simulated_users === undefined || this.model.simulated_users <= 0) {
      return false;
    }
    if (this.model.swarm_size === undefined || this.model.swarm_size <= 0) {
      return false;
    }
    if (this.model.duration_hours === undefined || this.model.duration_hours < 0) {
      return false;
    }
    if (this.model.duration_minutes === undefined || this.model.duration_minutes < 0) {
      return false;
    }
    if (this.model.duration_minutes === undefined || this.model.name === '') {
      return false;
    }
    if (this.model.load_test_file === undefined || !this.model.load_test_file) {
      return false;
    }
    return true;
  }
}
