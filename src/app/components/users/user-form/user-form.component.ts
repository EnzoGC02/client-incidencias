import { Component, OnInit } from '@angular/core';
//modelos
import {Users} from '../../../models/users'
import {Office} from '../../../models/offices'
import {Response} from '../../../models/response'
//servicios
import {OfficesService} from '../../../services/offices.service'
import {UsersService} from '../../../services/users.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {




 

  /*variables locales*/

  //esta variable se usa para añadir clase de exito o falla en el alerta despues que ocurre el evento de guardar un nuevo usuario
  classAlert:boolean;
  alertShow:boolean=false;
  officesList:Office[];
  userForm:FormGroup;
  //objetos
  user=new Users('',0);
  resp=new Response('','');


  //constructor
  constructor(
    private officeService:OfficesService,
    private userService:UsersService
    ) { 
      this.userForm=this.createFormGroup();
    }

  //metodos  
  ngOnInit() {
    this.getOfficesComponent();
  }
  createFormGroup(){
    return new FormGroup({
      name_user:new FormControl('',[
        Validators.required,Validators.minLength(4),Validators.maxLength(50)
      ]),
      id_office:new FormControl('',Validators.required),

    });
  }

  private getOfficesComponent(){
    this.officeService.getOffices()
    .subscribe(
      res=>{
        this.officesList=[];
        console.log(res);
          for(var office in res){
            let off=res[office];
            this.officesList=off;
          }
          console.log(this.officesList);
        }
    )

  }

  
  //Este metodo llama al servicio de user para poder almacenar el nuevo usuario
  private saveUserFromService(){
    this.userService.addUser(this.user)
    .subscribe(
      response=>{
        
        console.log(response);
        for(var res in response.body)
        {
          this.resp.setMsg(response.body["message"]);
          this.resp.setStatus(response.body["status"]);
        }
        console.log(this.resp);
 
      },
      complete=>{
        console.log(complete);
      }
    )
  }

  saveNewUser(){
    //si el formulario se valido correctamente
    if(this.userForm.valid){
      this.saveUserFromService();
      console.log(this.resp);
      if(this.resp.getStatus()==1)
      {
        
        this.classAlert=true;
      }
     // else this.classAlert=false;

      //mostrar el alerta de mensaje de respuesta
      this.alertShow=this.classAlert===undefined;
      console.log('Y Aqui que paso?');
    }
    //mostrar mensaje de campos incorrectos
    else{
      console.log('Invalid');
    }
  }

  onResetForm(){
    this.userForm.reset();  
  }

  private get nameUser(){
    return this.userForm.get('name_user');
  }

  private get Oficina(){
    return this.userForm.get('id_office');
  }

}
