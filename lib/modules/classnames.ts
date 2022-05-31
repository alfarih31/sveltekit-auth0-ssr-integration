type OClass = {
	[key: string]: boolean;
};

type Args = string | OClass;

export default function classnames(...classes: Args[]): string {
	const classnames = classes.reduce<Set<string>>((accum, curr) => {
		switch (typeof curr) {
			case 'object':
				return new Set<string>([
					...accum,
					...Array.from(
						Object.entries(curr).reduce<Set<string>>((a, [key, val]) => {
							if (val) {
								a.add(key);
							}

							return a;
						}, new Set<string>())
					),
				]);
			case 'string':
				accum.add(curr);
				return accum;
		}

		return accum;
	}, new Set<string>());

	return Array.from(classnames).join(' ');
}
