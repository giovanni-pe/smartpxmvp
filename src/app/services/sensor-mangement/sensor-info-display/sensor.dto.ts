export interface SensorDTO {
    id: number;
    type: string;
    status: number;
    irrigation_status: number;
    greenhouse_id: number;
    created_at: string;
    greenhouse?: GreenhouseDTO;  
  }
  
  export interface GreenhouseDTO {
    id: number;
    name: string;
  }
  