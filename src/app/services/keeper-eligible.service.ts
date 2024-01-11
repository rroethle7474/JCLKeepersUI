import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { MlbStatsService } from './mlb-stats-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeeperEligibleService {

  private navbarExpanded = new BehaviorSubject<boolean>(false);

  constructor(private mlbStatsService: MlbStatsService) { }

  parseCSV(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results),
        error: (error) => reject(error)
      });
    });
  }

  setNavbarState(isExpanded: boolean) {
    this.navbarExpanded.next(isExpanded);
  }

  getNavbarState() {
    return this.navbarExpanded.asObservable();
  }



  // STEPS
  // 1. FILTER BY DATE
  // 2. SORT BY TEAMS
  // 3. CALCULATE NEW VALUE
  // 4. LOOP OVER EACH TEAM FOR A GIVEN TAB AND POPULATE
  // 5. DO I NEED TO HAVE A POSITION MATRIX TO  SORT BY?

  parseDate(dateString: string): Date{
    // Adjust this to match the specific format of your date strings if needed
    const formattedDateString = dateString.replace(' (CST)', '');
    console.log("FORMATED DATE STRING", formattedDateString);
    const date = new Date(formattedDateString);
    console.log("IS THIS BAD", date);
    //console.log("WHAT IS THE Formatted DATE STRING", dateString);

    let formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    console.log("WHAT IS THE DATE HERE", formattedDate);

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  convertTransactionDateToDate = (dateStr: string): Date => {
    // Remove the day of the week
    let formattedStr = dateStr.replace(/^[a-zA-Z]{3}\s/, '');
    // Extract the time part and convert it to 24-hour format
    let timePart = formattedStr.split(', ')[2];
    let [time, modifier] = timePart.split(/(AM|PM)/i);

    let [hours, minutes] = time.split(':').map(Number);
    if (modifier.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
    } else if (modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }

    // Reconstruct the date string in a format that Date can parse
    let dateString = formattedStr.split(', ')[0] + ', '+ formattedStr.split(', ')[1] + ', '+ hours + ':' + minutes;

    return new Date(dateString);
}


  filterByTargetDateTransactionLog(data: any[], targetDate: Date): any[]{
    return data.filter(item => {
      const itemDateValue = item['TransactionDate'];
      if(!itemDateValue){
        return false;
      }
      try{
        const itemDate = this.convertTransactionDateToDate(itemDateValue);
        // if(itemDate > targetDate){
        //   console.log("GOOD DATA")
        // }
        return itemDate > targetDate;
      }
      catch(e){
        console.log("ERROR", e);
      }
      return false;
    });
  }

  filterCurrentPlayerList(playerList: any[]): any[]{
    console.log("PLAYER LIST WITHIN FILTER", playerList);
    const statusValues = [...new Set(playerList.map(item => item['Status']))];
    console.log("COULD THIS WORK",statusValues);
    return playerList.filter(item => {
      const invalidTeam = "FA";
      if(item['JCLTeam'] === invalidTeam){
        return false;
      };
      return true;
    });
  }

  filterPreviousPlayerList(playerList: any[]): any[]{
    return playerList.filter(item => {
      const minorTerm = "Minors";
      if(item['Roster Status'] === minorTerm){
        return true;
      };
      return false;
    });
  }

  generateCSV(data: any[]): string {
    // create workbook and default teams with headers
    const workbook = XLSX.utils.book_new();
    let prettyJson = JSON.stringify(data, null, 2);
    console.log("PRETTY JSON", prettyJson);
    // Target date for comparison
    // const targetDate = new Date('August 6, 2023 00:00:00 CST');

    const targetDate = new Date(2023, 7, 6); // Note: Month is 0-indexed, 7 = August

    // Function to convert date string to Date object


    // Filter the array
    let index = 1
    const filteredData = data.filter(item => {
      const itemDateValue = item['Date (CST)'];
      if(!itemDateValue){
        console.log("IN HERE");
        return false;
      }
      index ++;
      const itemDate = this.parseDate(itemDateValue);
      return itemDate > targetDate;
    });

    console.log(filteredData);

    return Papa.unparse(data);
  }

  createXLSXFile(data: any[]): void {
    const statusValues = [...new Set(data.map(item => item['Status']))];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Keeper Eligible');
    XLSX.writeFile(workbook, 'Keeper Eligible.xlsx');
  }

  createXLSXFile2(data: any[]): void {
    const statusValues = [...new Set(data.map(item => item['Status']))];
    const workbook = XLSX.utils.book_new();

    statusValues.forEach((status) => {
      const filteredData = data.filter(item => item['Status'] === status);
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      XLSX.utils.book_append_sheet(workbook, worksheet, status);
    });

    XLSX.writeFile(workbook, 'Keeper Eligible.xlsx');
  }

  createFinalXLSXFile(hitters: any[], pitchers: any[]): boolean {
    try {
      let hitterTeamValues = [...new Set(hitters.map(item => item['Status']))];
      let pitcherTeamValues = [...new Set(pitchers.map(item => item['Status']))];

      const statusValues = [...new Set([...hitterTeamValues, ...pitcherTeamValues])];
      const workbook = XLSX.utils.book_new();

      let headers = {...(hitters[0] || {}), ...(pitchers[0] || {})};
      headers = Object.keys(headers).reduce((acc, key) => ({ ...acc, [key]: key }), {});
        // Create a template object with all keys set to undefined
      //const template = Object.keys(headers).reduce((acc, key) => ({ ...acc, [key]: undefined }), {});

      let summaryData: any[] = [];

      statusValues.forEach((status) => {
        const hitterData = hitters.filter(item => item['Status'] === status);
        const pitcherData = pitchers.filter(item => item['Status'] === status);
        const template = Object.keys(headers).reduce((acc, key) => ({ ...acc, [key]: undefined }), {});
          // Create total rows
        const hitterCurrentSalary = hitterData.reduce((acc,item) => acc + Number(item['Salary'] || 0), 0);
        const hitterNewSalary = hitterData.reduce((acc,item) => acc + Number(item['New_Salary'] || 0), 0);
        const hitterTotal = { ...template, 'Player': 'Total for hitters', 'Salary': hitterCurrentSalary, 'New_Salary': hitterNewSalary };

        const pitcherCurrentSalary = pitcherData.reduce((acc,item) => acc + Number(item['Salary'] || 0), 0);
        const pitcherNewSalary = pitcherData.reduce((acc,item) => acc + Number(item['New_Salary'] || 0), 0);
        const pitcherTotal = { ...template, 'Player': 'Total for pitcher', 'Salary': pitcherCurrentSalary, 'New_Salary': pitcherNewSalary };
        const total = { ...template, 'Player': 'Total', 'Salary': hitterCurrentSalary + pitcherCurrentSalary, 'New_Salary': hitterNewSalary + pitcherNewSalary };

        summaryData.push({ 'Status': status, 'Salary': hitterCurrentSalary + pitcherCurrentSalary, 'New_Salary': hitterNewSalary + pitcherNewSalary });

       // const pitcherTotal = pitcherData.reduce((acc, item) => ({ ...acc, 'Salary': (acc['Salary'] || 0) + Number(item['Salary'] || 0), 'New_Salary': (acc['New_Salary'] || 0) + Number(item['New_Salary'] || 0) }), { ...template, 'Player': 'Total for pitchers' });
          // create header object to use for inserting pitcher data
        //const headers = pitcherData.length > 0 ? Object.keys(pitcherData[0]).reduce((acc, key) => ({ ...acc, [key]: key }), {}) : {};
        //console.log("TEMPLATE", template);
        const mappedHitterData = hitterData.map(item => ({ ...template, ...item }));
        const mappedPitcherData = pitcherData.map(item => ({ ...template, ...item }));
        const totalData = [...mappedHitterData, hitterTotal, {}, headers, ...mappedPitcherData, pitcherTotal, {}, total  ];
        const worksheet = XLSX.utils.json_to_sheet(totalData);
        XLSX.utils.book_append_sheet(workbook, worksheet, status);
      });

    // Create a summary sheet with the total values
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      XLSX.writeFile(workbook, 'Keeper Eligible.xlsx');
      return true;
    }
    catch(e){
      console.log("ERROR", e);
      return false;
    }
  }



  async getKeeperEligibility(name: string, isHitter: boolean): Promise<any> {
    try {
      const response = await this.mlbStatsService.getPlayerEligibility(name, isHitter);
      console.log("RESPONSE", response.is_valid_to_keep);
      if(response?.is_valid_to_keep === undefined){
        return false; // proably should alert or throw an  error here since no player was found.
      }
      return response.is_valid_to_keep;
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  // createXLSXFile3(data: any[]) {
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = workbook.addWorksheet('My Sheet');

  //   const reorderedData = data.map(item => {
  //     const { Salary, ...restOfProperties } = item;
  //     return { ...restOfProperties, Salary };
  //   });

  //   worksheet.columns = Object.keys(reorderedData[0]).map(key => {
  //     return { header: key, key: key };
  //   });

  //   worksheet.addRows(reorderedData);

  //   workbook.xlsx.writeFile('My File.xlsx');
  // }
}
