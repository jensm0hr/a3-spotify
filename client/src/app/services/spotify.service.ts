import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //Gets request to the Express endpoint and returns the response.
    //Specifically, updates the URI according to the base URL for express and the endpoint.
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //Identifies the search endpoint in the express webserver (routes/index.js) and sends the request to express.
    //Encodes the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), returns an array of that type of data.
    return this.sendRequestToExpress('/search/' + category + '/' + encodeURIComponent(resource)).then((data) => {
      if(category === 'artist') {
        return data.artists.items.map((item:any) => new ArtistData(item));
      }
      else if(category === 'album') {
        return data.albums.items.map((item:any) => new AlbumData(item));
      }
      else {
        return data.tracks.items.map((item:any) => new TrackData(item));
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //Uses the artist endpoint to make a request to express.
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((data) => new ArtistData(data));
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //Uses the top tracks endpoint to make a request to express.
    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((data) =>
      data.tracks.map((t:any) => new TrackData(t)));
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //Uses the albums for an artist endpoint to make a request to express.
    return this.sendRequestToExpress('/artist-albums/' + encodeURIComponent(artistId)).then((data) =>
      data.items.map((a:any) => new AlbumData(a)));
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //Uses the albums endpoint to make a request to express.
    return this.sendRequestToExpress('/album/' + encodeURIComponent(albumId)).then((data) => new AlbumData(data));
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //Uses the tracks for album endpoint to make a request to express.
    return this.sendRequestToExpress('/album-tracks/' + encodeURIComponent(albumId)).then((data) =>
      data.items.map((t:any) => new TrackData(t)));
  }

  getTrack(trackId:string):Promise<TrackData> {
    //Uses the track endpoint to make a request to express.
    return this.sendRequestToExpress('/track/' + encodeURIComponent(trackId)).then((data) => new TrackData(data));
  }
}