export class DueDate {
  private readonly value: Date

  private constructor(value: Date) {
    this.value = value
  }

  static create(date: Date): DueDate {
    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid due date')
    }

    return new DueDate(date)
  }

  getValue(): Date {
    return this.value
  }

  isWithinNextHours(hours: number): boolean {
    const now = new Date()
    const diff = this.value.getTime() - now.getTime()
    return diff >= 0 && diff <= hours * 60 * 60 * 1000
  }
}
