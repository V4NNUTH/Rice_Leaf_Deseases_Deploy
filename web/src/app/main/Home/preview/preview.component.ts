import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector   : 'app-home-preview',
    templateUrl: './preview.component.html',
    styleUrls  : ['./preview.component.scss']
})
export class HomePreviewComponent implements OnInit 
{
    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
        private dialogRef: MatDialogRef<HomePreviewComponent>,
    )
    {
    }
    ngOnInit(): void {
        console.log(this.data);
        
    }

    close(){
        this.dialogRef.close()
    }


}
