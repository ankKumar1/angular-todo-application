import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToDoFilterPipe } from './pipes/to-do-filter.pipe';
import { DisplayTaskComponent } from './display-task/display-task.component';
import { ToDoService } from './to-do.service';


@NgModule({
  declarations: [
    AppComponent,
    ToDoFilterPipe,
    DisplayTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ToDoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
