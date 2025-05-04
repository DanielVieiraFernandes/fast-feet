interface PaginatedDto {
  page?: number;
  size?: number;
  pickedUpAt?: boolean;
}

export class Paginated<T extends PaginatedDto> {
  private page: number;
  private size: number;

  public skip: number;
  public take: number;
  public pickedUpAt: boolean;

  constructor(dto: T) {
    this.page = dto.page ?? 1;
    this.size = dto.size ?? 20;
    this.pickedUpAt = dto.pickedUpAt ?? false;

    this.skip = (this.page - 1) * this.size;
    this.take = this.size;
  }
}
