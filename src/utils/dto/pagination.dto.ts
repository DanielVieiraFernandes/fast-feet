import { PaginatedRequestDto } from './paginated-request.dto';

export class Paginated {
  private page: number;
  private size: number;

  public skip: number;
  public take: number;

  constructor(dto: PaginatedRequestDto) {
    this.page = dto.page ?? 1;
    this.size = dto.size ?? 20;

    this.skip = (this.page - 1) * this.size;
    this.take = this.size;
  }
}
