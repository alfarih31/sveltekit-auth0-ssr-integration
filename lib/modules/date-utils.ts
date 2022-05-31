import { DateTime, Settings } from 'luxon';

Settings.defaultZone = 'UTC';
Settings.defaultLocale = 'id';

export const Equality = {
	EQUAL: 'EQ',
	GREATER_THAN: 'GT',
	LESS_THAN: 'LT',
};

export default class DateUtils {
	static toEpoch(t: Date): number {
		return Math.round(t.getTime() / 1000);
	}

	static fromEpoch(sec: number): Date {
		const d = new Date(0);
		d.setUTCSeconds(sec);
		return d;
	}

	static addSecond(t: Date, sec: number): Date {
		let epoch = this.toEpoch(t);
		epoch += sec;
		return this.fromEpoch(epoch);
	}

	static compare(t1: Date, t2: Date): string {
		const diff = t1.getTime() - t2.getTime();

		if (diff < 0) {
			return Equality.LESS_THAN;
		} else if (diff > 0) {
			return Equality.GREATER_THAN;
		} else {
			return Equality.EQUAL;
		}
	}

	static getLocalNow(): string {
		return DateTime.local().toISO();
	}

	static timeBefore(ISOString: string, days: number): string {
		return DateTime.fromISO(ISOString).minus({ days }).toString();
	}

	static toUTC(ISOString: string): string {
		return DateTime.fromISO(ISOString).toUTC().toString();
	}

	static fromZone(dateString: string, format: string, zone: string): string {
		return DateTime.fromFormat(dateString, format, { zone }).toISO();
	}

	static toZone(dateObject: Date, zone: string): string {
		return DateTime.fromISO(dateObject.toISOString(), { zone }).toISO();
	}
}
