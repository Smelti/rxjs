import { Injectable } from "@nestjs/common";
import {
  firstValueFrom,
  toArray,
  from,
  map,
  mergeAll,
  take,
  Observable,
} from "rxjs";
import axios from "axios";

@Injectable()
export class RxjsService {
  private readonly githubURL = "https://api.github.com/search/repositories?q=";

  private getGithub(text: string, count: number = 10): Observable<any> {
    return from(axios.get(`${this.githubURL}${text}`)).pipe(
      map((res: any) => res.data.items),
      mergeAll(),
      take(count)
    );
  }

  async searchRepositories(text: string, hub: string, count?: number): Promise<any> {
    let data$: Observable<any>;

    if (hub === "github") {
      data$ = this.getGithub(text, count).pipe(toArray());
    } else {
      throw new Error(`Unsupported hub: ${hub}`);
    }

    return await firstValueFrom(data$);
  }
}