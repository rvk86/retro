class Config {
  constructor() {
    this.facebookAppID = '198407367319295';
    this.googleMapsApiKey = 'AIzaSyBjECHlDoNzrDJm-_PLKbl2vltu_8H9-_I';

    if(process.env.NODE_ENV === 'production') {
      this.facebookAppID = '198393670653998';
    }
  }
}

export default new Config();
