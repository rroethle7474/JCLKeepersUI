## Project Description
*** Note: The UI has not been completed and was merged with another project. The UI will be updated to accurately reflect the functionality of this project.

The purpose of this app right now is to upload the transactions from the previous year, and generate an output for available keepers in our league using the Python API app (PlayerApi) which validates each player using the MLB stats api.


## Technologies used and How to Run 

### Technologies
- **Angular 17**: Frontend framework for building the user interface
- **TypeScript**: Programming language for type-safe JavaScript development
- **Bootstrap 5.3**: UI component library for responsive design
- **PapaParse**: CSV parsing library for processing transaction and player data files
- **XLSX**: Excel file generation for keeper reports
- **HTTP Client**: For API integration with the PlayerAPI backend

This project uses the PlayerAPI ([text](https://github.com/rroethle7474/PlayerApi)) to retrieve stats for the determining allowable keepers.

Also this project and the [text](https://github.com/rroethle7474/JCL2025-Roster) repo will be tied together eventually to create one app to load in keepers each year for our fantasy baseball league.

### How to Run

1. **Prerequisites**:
   - Node.js (v16.x or later recommended)
   - npm (v8.x or later)
   - Angular CLI (`npm install -g @angular/cli`)
   - The PlayerAPI backend service running locally (see [PlayerAPI repo](https://github.com/rroethle7474/PlayerApi))

2. **Installation**:
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Navigate to project directory
   cd JCLKeepersUI
   
   # Install dependencies
   npm install
   ```

3. **Development Server**:
   ```bash
   # Start the Angular development server
   ng serve
   ```
   Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

4. **Build for Production**:
   ```bash
   # Build the project for production
   ng build
   ```
   The build artifacts will be stored in the `dist/` directory.

## Environment Settings

The application requires the following environment settings in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/',  // PlayerAPI base URL
  playerData: 'playerdata/?',        // Player data endpoint: TO-DO remove from this and add to services.
  openAIKey: '[your-api-key]',       // NOT USED: For AI-related features in the future.
  voterScraperUrl: '',               // NOT USED: Future functionality to implement a blockchain like voter page for the league.
};
```

For production environments, create an `environment.prod.ts` file with appropriate values.
