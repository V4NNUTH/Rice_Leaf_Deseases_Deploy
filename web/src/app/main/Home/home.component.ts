import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { HomePreviewComponent } from './preview/preview.component';
import { HomeViewInfoComponent } from './info/info.component';
import {HomeService} from './home.service'
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from 'app/shared/global-constants';
@Component({
    selector   : 'app-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class HomeComponent implements OnInit 
{
    
    public AllFile:any[]=[]
    public selectedFile:any;
    public isScanning:boolean=false;
    public isOnDrag:boolean=false
    /**
    * Constructor
    */
    constructor(
        private _dialog: MatDialog,
        private snackbarService: SnackbarService,
        private _HomeService: HomeService,
        
        )
        {
        }
        ngOnInit(): void {
            
        }
        async onChangeFile(File:any){
            this.selectedFile={
                file:File.files[0],
                base64:await this.imgToBase64(File.files[0]),
                msg:"Hello",
                percentage:'72%'
            }
            this.isOnDrag=false
            
        }
        
        async SubmitFile(){
            
            if(!this.selectedFile) return
            this.isScanning=true
            
            // console.log(File.files[0]);
            this._HomeService.getData(this.selectedFile).subscribe({
                next:(res=>{
                    
                    this.selectedFile.msg=res.label
                    this.selectedFile.percentage=res.probability
                    this.isScanning=false;
                    this.AllFile.push(this.selectedFile)
                    console.log(this.selectedFile);
                    this.selectedFile=null
                }),
                error: (err: HttpErrorResponse) => {
                    const error: { statusCode: number, message: string, error: string } = err.error;
                    this.isScanning = false;
                    this.snackbarService.openSnackBar(error.message, GlobalConstants.error);
                },
                
            })
            
            
            
            
            
        }
        
        imgToBase64(file: File): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const base64String = reader.result as string;
                    resolve(base64String);
                };
                
                reader.onerror = (error) => {
                    reject(error);
                };
                
                reader.readAsDataURL(file);
            });
        }
        
        previewImg(file:any){
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data=file
            // console.log(this.work_flow_review);
            
            dialogConfig.width = "100vw";
            dialogConfig.autoFocus = false;
            const dialogRef: MatDialogRef<HomePreviewComponent>  = this._dialog.open(HomePreviewComponent, dialogConfig);
            
            
            
            
        }
        
        viewInfor(event:any,file:any){
            if(event.target.classList.contains("ignore")) return
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data=file
            // console.log(this.work_flow_review);
            
            dialogConfig.width = "100vw";
            dialogConfig.autoFocus = false;
            const dialogRef: MatDialogRef<HomeViewInfoComponent>  = this._dialog.open(HomeViewInfoComponent, dialogConfig);
            
            
            
            
        }
        
        dragover(e:any){
            // if(!e.dataTransfer.files[0].type.startWith('image/')) return
            e.preventDefault();
            e.stopPropagation();

            this.isOnDrag=true
            
        }
        async dropFile(e:any){
            e.preventDefault();
            e.stopPropagation();
            console.log(e.dataTransfer.files[0].type,e.dataTransfer.files[0].type.startsWith('image/'));
       
            if(!e.dataTransfer.files[0].type.startsWith('image/')) return
            this.selectedFile={
                file: e.dataTransfer.files[0],
                base64:await this.imgToBase64( e.dataTransfer.files[0]),
                msg:"Hello",
                percentage:'72%'
            }
            console.log(this.selectedFile);
            
            this.isOnDrag=false
            
            
        }
        
        
        
    }
    