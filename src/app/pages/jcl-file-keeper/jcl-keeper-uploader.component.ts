// jcl-keeper-uploader.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { KeeperEligibleService } from '../../services/keeper-eligible.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-jcl-keeper-uploader',
  templateUrl: './jcl-keeper-uploader.component.html',
  styleUrls: ['./jcl-keeper-uploader.component.scss']
})
export class JclKeeperUploaderComponent implements OnInit, OnDestroy {
  jclCurrentPlayerList: File | null = null;
  jclTransactionLog: File | null = null;
  jclPreviousPlayerList: File | null = null;
  fileCreated = false;
  isProcessing = false;

  hitterPositionOrder : {[key: string]: any } = {
    "C": 1,
    "1B": 2,
    "2B": 3,
    "SS": 4,
    "3B": 5,
    "OF": 6,
    "UT": 7
  };

  pitcherPositionList : {[key: string]: any } = {
    "P": 1,
    "SP": 2,
    "RP": 3
}

  navbarExpanded: boolean = false;

  currentPlayerListData: any[] = [];
  transactionLogData: any[] = [];
  previousPlayerListData: any[] = [];

  private subscription: Subscription = new Subscription();


  constructor(private keeperService: KeeperEligibleService) { }

  ngOnInit(): void {
    this.subscription = this.keeperService.getNavbarState().subscribe(
      (isExpanded) => this.navbarExpanded = isExpanded
    );
  }

  onCurrentPlayerListUpload(event: any) {
    const file = event.target.files[0];
    const isCSV = this.isCSVFile(file);
    if (isCSV) {
      this.jclCurrentPlayerList = file;
      this.keeperService.parseCSV(file).then(data => {
        this.currentPlayerListData = this.keeperService.filterCurrentPlayerList(data.data);
        console.log("PLAYER LIST", this.currentPlayerListData);
     }).catch(error => {

        console.error(error);
        alert("ERROR PROCESSING FILE");
        this.jclCurrentPlayerList = null;
        this.currentPlayerListData = [];
        })
    }
  }

  onPreviousPlayerListUpload(event: any) {
    const file = event.target.files[0];
    const isCSV = this.isCSVFile(file);
    if (isCSV) {
      this.jclPreviousPlayerList = file;
      this.keeperService.parseCSV(file).then(data => {
        this.previousPlayerListData = this.keeperService.filterPreviousPlayerList(data.data);
        console.log("PREVIOUS PLAYER LIST", this.previousPlayerListData);
     }).catch(error => {
        console.error(error);
        alert("ERROR PROCESSING FILE");
        this.jclPreviousPlayerList = null;
        this.previousPlayerListData = [];
        })
    }
  }


  onTransactionHistoryUpload(event: any) {
    const file = event.target.files[0];
    const isCSV = this.isCSVFile(file);
    if (isCSV) {
      this.jclTransactionLog = file;
      this.keeperService.parseCSV(file).then(data => {
        // Process and manipulate data here
        const targetDate = new Date(2023, 7, 6); // Note: Month is 0-indexed, 7 = August
        this.transactionLogData = this.keeperService.filterByTargetDateTransactionLog(data.data, targetDate);
        console.log("PARSED DATA", this.transactionLogData);
        if(!this.transactionLogData || this.transactionLogData.length == 0){
          console.log("NO DATA");
          alert("NO DATA FOUND OR WRONG FILE");
          this.jclTransactionLog = null;
          this.transactionLogData = [];
        }
      //   //this.downloadCSV(newCsvData);
     }).catch(error => {
        console.error(error);
        alert("ERROR PROCESSING FILE");
        this.jclTransactionLog = null;
        this.transactionLogData = [];
        });
    }
  }

  allFilesSelected(): boolean {
    return this.jclCurrentPlayerList !== null && this.jclTransactionLog !== null && this.jclPreviousPlayerList !== null;
  }

  downloadCSV(csvData: string) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'new-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  isCSVFile = (csvFile: File): Boolean => {
    let isValid = false;

    if (csvFile) {
        const fileName = csvFile.name;
        //var fileType = csvFile.type;

        // Check the file extension
        if (fileName.slice(-4).toLowerCase() === '.csv') {
            isValid = true;
        } else {
            console.log("File is not a CSV.");
            // Handle non-CSV file scenario
        }

        // // Optionally, check the MIME type as well
        // // MIME type for CSV can be 'text/csv'
        // if (fileType === 'text/csv') {
        //     console.log("MIME type confirms it's a CSV.");
        // } else {
        //     console.log("MIME type does not confirm it's a CSV.");
        // }
    }
    return isValid;
}

  async onKeeperSubmit(event: any) {

    let pitchers: any[] = [];
    let hitters: any[] = [];
    let previousMinorLeaguePlayers = [];
    this.isProcessing = true;

    // transaction log section
    // remove players from current player list if they were added after the keeper deadline, deadline date handled when file is uploaded
    this.transactionLogData.forEach((item) => {
      const playerIndex = this.currentPlayerListData.findIndex((player) => player['Player'] === item['Player']);
      if(playerIndex !== -1){
        this.currentPlayerListData.splice(playerIndex, 1);
      }
    });

    // minor league section
    // Get Previous Salary Increment on Minor League to use for upcoming salary increment based on years held by team
    previousMinorLeaguePlayers = this.previousPlayerListData.filter((player) => player['Roster Status'] === 'Minors');

    previousMinorLeaguePlayers.forEach((item) => {
      const minorLeaguerIndex = this.currentPlayerListData.findIndex((player) => player['Player'] === item['Player']);
      if(minorLeaguerIndex !== -1){
        const salaryIncrement = this.currentPlayerListData[minorLeaguerIndex]['Salary'] - item['Salary'];
        if(salaryIncrement > 0){
          this.currentPlayerListData[minorLeaguerIndex]['PreviousIncrement'] = this.currentPlayerListData[minorLeaguerIndex]['Salary'] - item['Salary'];
        }
      }
    });

    let zeroDollarPlayers = this.currentPlayerListData.filter((player) => player['Salary'] === '0.00');
    //console.log("ZERO DOLLAR PLAYERS LENGTH", zeroDollarPlayers.length);

    // let zeroDollarPlayersSubset = zeroDollarPlayers.slice(0, 10);
    // seperate list into pitchers and hitters
    // remove invalid players with not enough at bats or innings pitched

    let zeroDollarPlayerCount = 0;

    //this.currentPlayerListData = this.currentPlayerListData.splice(0, 10);
    //console.log("CURRENT PLAYER LIST DATA", this.currentPlayerListData);
    for(let player of this.currentPlayerListData){
          //console.time('Iteration time'); // Start timer

          const position = player['Position'];
          const hitterName = player.Player;
          let isValid = true;

          if (player && player !== '') {
            delete player['RkOv'];
            delete player['ID'];
            delete player['Opponent'];
            delete player['Ros'];
            if (position?.toLowerCase().includes('p') && !position?.toLowerCase().includes('u')) {
                if(player['Salary'] === '0.00'){
                  //console.log("ZERO DOLLAR PITCHER", player);
                  isValid = await this.keeperService.getKeeperEligibility(hitterName, true);
                  zeroDollarPlayerCount++;
                  //console.log("IS VALID", isValid);
                }
                if(isValid)
                  pitchers.push(player);
            } else if(position == '' || position == undefined || position == null){
                //console.log("NO POSITION", player);
              }
              else{
                if(player['Salary'] === '0.00'){
                  isValid = await this.keeperService.getKeeperEligibility(hitterName, false);
                  zeroDollarPlayerCount++;
                  //console.log("IS VALID", isValid);
                }
                if(isValid)
                  hitters.push(player);
              }
            }
            //console.timeEnd('Iteration time'); // End timer and log the time to the console
    }

    //console.log("FINAL ZERO DOLLAR PLAYER COUNT", zeroDollarPlayerCount);


    hitters.sort((a, b) => {
      const aPosition : string = a['Position'].split(',')[0];
      const bPosition : string = b['Position'].split(',')[0];

      return this.hitterPositionOrder[aPosition] - this.hitterPositionOrder[bPosition];
    });



    pitchers.sort((a,b) => {
      const aPosition : string = a['Position'].split(',')[0];
      const bPosition : string = b['Position'].split(',')[0];

      return this.pitcherPositionList[aPosition] - this.pitcherPositionList[bPosition];
    });

    hitters.forEach((player) => {
      player["New_Salary"] = this.setNewSalary(player);
    });

    pitchers.forEach((player) => {
      player["New_Salary"] = this.setNewSalary(player);
    });


    //console.log("PITCHERS", pitchers);
    //console.log("HITTERS", hitters);
    // filter by position, remove extra columns, try and seperate hitters and pitchers
    const wasCreated = this.keeperService.createFinalXLSXFile(hitters, pitchers);
    if(wasCreated){
      alert("FILE CREATED");
      this.fileCreated = true;
    }
    else{
      alert("ERROR CREATING FILE");
      this.fileCreated = false;
    }
    this.isProcessing = false;
    //console.log("IS PROCESSING", this.isProcessing)
  }

  // private functions
  setNewSalary(player: any): number {
    const salary = parseFloat(player['Salary']);
    let newSalary = salary;
    const isMinorLeaguer : boolean = player['Roster Status'] === 'Minors';
    if(isMinorLeaguer) {
      let increment = parseFloat(player['PreviousIncrement']);
      if(isNaN(increment)){
        increment = 1;
      }
      newSalary = salary + increment;
      return newSalary;
    }
    if(salary >=20){
      newSalary = salary + 5;
    }
    else{
      newSalary = salary + 3;
    }
    return newSalary;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}


// next steps
// find an api that I can use to pass in a player to retrieve if they are valid or not for keeper
// only need to retrieve if salary is 0.
// create an array of players per team, remove players based on transaction log, then assemble a new array based on $0 salary
// sort array by team, position, then create new spreadsheet
