import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {SearchResult} from "../../../data/models/search_result";
import {MatSelectionList} from "@angular/material/list";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SearchResultItem} from "../../../data/models/search_result_item";
import {SearchLinkService} from "../../../data/services/search-link.service";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialsModule} from "../../materials/materials.module";
import {Media} from "../../../data/models/media";
import {Source} from "../../../data/models/source";

@Component({
  selector: 'app-dialog-search-base',
  standalone: true,
  imports: [
    MaterialsModule,
    ReactiveFormsModule
  ],
  templateUrl: './dialog-search-base.component.html',
  styleUrl: './dialog-search-base.component.css'
})
export abstract class DialogSearchBaseComponent implements OnInit, AfterViewInit {
  searchResult: SearchResult;
  lastKeyword!: string
  selected: Source[] = [];
  isLoading = true;
  error: any;
  media: Media;

  @ViewChild('links') links: MatSelectionList;
  @ViewChild("queryInput") queryInput: ElementRef;
  @ViewChild("addSourceInput") addSourceInput!: ElementRef;

  abstract cx: string;

  protected constructor(
    @Inject(MAT_DIALOG_DATA)
    public options: {
      positionRelativeToElement: ElementRef,
      media: Media
    },
    private dialogRef: MatDialogRef<SearchResultItem[]>,
    private service: SearchLinkService,
  ) {
    this.media = options.media
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.queryInput.nativeElement.value = this.media.title;
    this.queryInput.nativeElement.disabled = true;
    this.search(this.media.title)
  }

  isEditing() {
    return this.queryInput != null && this.queryInput.nativeElement.disabled == false
  }

  selectionChange($event: any) {
  }

  submitData() {
    if (this.links != null) {
      const options = this.links.options.toArray();
      for (let index = 0; index < options.length; index++) {
        const element = options[index];
        if (element.selected) {
          let searchResultItem = this.searchResult.items[index];
          this.selected.push(this.processSourceString(searchResultItem.title, searchResultItem.link));
        }
      }
    }
    this.dialogRef.close(this.selected);
  }

  onHeaderBtnClick() {
    let queryInput = this.queryInput.nativeElement
    if (this.isEditing()) {
      this.search(queryInput.value);
    } else {
      queryInput.disabled = !queryInput.disabled;
      if (!queryInput.disabled) {
        queryInput.focus();
        queryInput.setSelectionRange(0, queryInput.value.length);
      }
    }
  }

  private search(value: string) {
    if (value == this.lastKeyword) {
      return
    }
    this.lastKeyword = value
    this.service.search(value, this.cx).subscribe({
        next: (v) => {
          this.isLoading = false;
          this.searchResult = v;
        },
        error: (e) => {
          this.isLoading = false;
          this.error = e;
        }
      }
    )
  }

  fillOriginalTitle() {
    this.queryInput.nativeElement.value = this.media.originalTitle;
    this.search(this.media.originalTitle);
  }

  saveManualInputSource() {
    let input = this.addSourceInput?.nativeElement.value;
    if (input == undefined || input.length < 5 || this.media.title == undefined) {
      return
    }
    const source = this.processSourceString(this.media.title, this.addSourceInput?.nativeElement.value)
    let find = this.selected.find(value => value.shortUrl == source.shortUrl);
    if (find == null && source.shortUrl != undefined) {
      this.selected.push(source)
      console.log(source.shortUrl);
    }
  }

  abstract processSourceString(title: string, sourceStr: string): Source;
}
