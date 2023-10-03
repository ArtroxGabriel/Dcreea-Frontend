import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ClarityModule } from "@clr/angular";
import { NgSelectModule } from "@ng-select/ng-select";
import { ContenteditableModule } from "@ng-stack/contenteditable";
import { ColorPickerModule } from "ngx-color-picker";
import { NgxPrintModule } from "ngx-print";
// import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { ApiInterceptorModule } from "../api.interceptor";
import { commonComponents, flattenPageComponents, PipeModule } from "../app.imports";

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    RouterModule,
    ClarityModule,
    // AngularMultiSelectModule,
    FormsModule,
    ContenteditableModule,
    ApiInterceptorModule,
    HttpClientModule,
    PipeModule,
    DragDropModule,
    ColorPickerModule,
    commonComponents,
    NgxPrintModule,
    // DndModule
  ],
  declarations: [commonComponents],
  exports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    RouterModule,
    ClarityModule,
    // AngularMultiSelectModule,
    FormsModule,
    ContenteditableModule,
    ApiInterceptorModule,
    HttpClientModule,
    PipeModule,
    DragDropModule,
    ColorPickerModule,
    commonComponents,
    NgxPrintModule,
    // DndModule
  ],
})
export class SharedModule {}

@NgModule({
  imports: [SharedModule],
  declarations: [flattenPageComponents],
  exports: [flattenPageComponents],
})
export class MainModule {}
