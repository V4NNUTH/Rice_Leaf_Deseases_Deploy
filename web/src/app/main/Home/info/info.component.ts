import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HomeService } from '../home.service';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from 'app/shared/global-constants';

@Component({
    selector   : 'app-home-info',
    templateUrl: './info.component.html',
    styleUrls  : ['./info.component.scss']
})
export class HomeViewInfoComponent implements OnInit 
{
    /**
     * Constructor
     */
    public infor:any;
    public isLoading:boolean=true;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
        private dialogRef: MatDialogRef<HomeViewInfoComponent>,
        private _HomeService: HomeService,
        private snackbarService: SnackbarService,
    )
    {
    }
    ngOnInit(): void {
        this._HomeService.getDiseaseInfo(this.data?.msg).subscribe({
            next:(res:any)=>{
                this.infor=res;
                this.isLoading=false
            },
            error: (err: HttpErrorResponse) => {
                const error: { statusCode: number, message: string, error: string } = err.error;
                this.isLoading=false
                this.snackbarService.openSnackBar(error.message, GlobalConstants.error);
            },
        })
        
    }
    close(){
        this.dialogRef.close()
    }
}
