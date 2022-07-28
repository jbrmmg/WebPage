import {Component, OnInit} from "@angular/core";
import {BackupService} from "../backup.service";
import {Action} from "../backup-action";

@Component({
    selector: 'jbr-backup-import',
    templateUrl: './backup-import.component.html',
    styleUrls: ['./backup-import.component.css']
})
export class BackupImportComponent implements OnInit  {
    public actions: Action[];
    selectedIndex: number;
    category: string;
    importDirectory: string;
    preImportDirectory: string;
    destinationDirectory: string;

    constructor(private readonly _backupService: BackupService) {
    }

    ngOnInit(): void {
        this.actions = [];
        this.category = "AtHome";
        this.importDirectory = "";
        this.preImportDirectory = "";
        this.destinationDirectory = "";

        this._backupService.getSummary().subscribe(
            summary => {
                console.log("Got summary")
                let destination = -1;
                summary.sources.forEach( (nextSource) => {
                    if (nextSource.type === "PIMP") {
                        this.preImportDirectory = nextSource.path;
                    }
                    if (nextSource.type === "IMPS") {
                        this.importDirectory = nextSource.path;
                        destination = nextSource.destinationId;
                    }
                });
                if (destination !== -1) {
                    summary.sources.forEach((nextSource) => {
                        if (nextSource.type === "SRCE" && nextSource.id === destination) {
                            this.destinationDirectory = nextSource.path;
                        }
                    });
                }
            },
            () => console.log('Failed to get summary.'),
            () => console.log('Load Actions summary')
        );

        this._backupService.getActions().subscribe(
            actions => {
                this.actions = [];

                actions.forEach(nextAction => {
                    if(nextAction.action == "IMPORT") {
                        this.actions.push(nextAction);
                    }
                })

                console.log("Sort the list")
                this.selectedIndex = 0;
                this.actions = this.actions.sort((a1,a2) => {
                    if(a1.fileName > a2.fileName)
                        return 1;

                    if(a1.fileName < a2.fileName)
                        return -1;

                    return 0;
                })

                this._backupService.getConfirmedActions().subscribe(
                    actions => {
                        actions.forEach(nextAction => {
                            if(nextAction.action == "IMPORT") {
                                this.actions.push(nextAction);
                            }
                        })
                    },
                    () => console.log('Failed to get confirmed actions.'),
                    () => console.log('Load Actions confirmed Complete')
                );
            },
            () => console.log('Failed to get actions.'),
            () => console.log('Load Actions Complete')
        );
    }

    findActionIndexForId(id: number): number {
        let nextIndex: number;
        let result: number;
        nextIndex = 0;
        this.actions.forEach(a => {
            if(a.id === id) {
                result = nextIndex;
            }

            nextIndex++;
        })

        return result;
    }

    selectAction(id: number) {
        this.selectedIndex = this.findActionIndexForId(id);
    }

    ignore(id: number) {
        this._backupService.ignorePhoto(id);
        this.actions[this.findActionIndexForId(id)].parameter = 'ignore';
    }

    import(id: number, directory: string) {
        this._backupService.keepPhoto(id,directory);
        this.actions[this.findActionIndexForId(id)].parameter = directory;
    }

    moveToRecipe(id: number) {
        this._backupService.recipePhoto(id);
        this.actions[this.findActionIndexForId(id)].parameter = 'recipe';
    }

    get isItemSelected(): boolean {
        return this.actions.length > 0 && this.selectedIndex !== -1;
    }

    imageUrl(id: number): string {
        return this._backupService.imageUrl(id);
    }

    videoUrl(id: number): string {
        return this._backupService.videoUrl(id);
    }

    setCategory(category: string) {
        this.category = category;
    }

    convert() {
        this._backupService.convert();
    }

    doImport() {
        this._backupService.importFiles();
    }

    process() {
        this._backupService.processImport();
    }
}
