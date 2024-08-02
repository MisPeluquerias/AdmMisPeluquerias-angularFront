import { Component,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditHomeService } from '../../../core/service/edit-home.service';

@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrl: './edit-home.component.scss'
})
export class EditHomeComponent implements OnInit{


  salonId:number = 0;
  salonData:any[]=[];

  constructor(private route : ActivatedRoute,private editHomeService:EditHomeService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.salonId = id ? +id : 0;  // Convierte el ID a número, asegurándose de que es un valor válido
      if (this.salonId) {
        this.getSalonData(this.salonId);
      }
    });
  }

  getSalonData(id_salon: number): void {
    this.editHomeService.getSalonById(id_salon).subscribe(
      data => {
        this.salonData = data;  // Guarda los datos recibidos en la variable salonData
        //console.log('Salon data:', this.salonData);
      },
      error => {
        //console.error('Error fetching salon data:', error);
      }
    );
  }
}
