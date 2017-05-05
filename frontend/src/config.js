class Config {
  constructor() {
    this.facebookAppID = '198407367319295';
    this.googleMapsApiKey = 'AIzaSyAy2awhVyQuvbdg0-3AzPZdUJpRejF9yj8';
    
    if(process.env.NODE_ENV === 'production') {
      this.facebookAppID = '198393670653998';
    }
  }
}

export default new Config();
