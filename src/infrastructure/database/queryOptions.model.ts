import { FindOptions, Includeable, Order } from "sequelize/types";

export interface IQueryOptions {

	include?: Includeable[];

	order?: Order;

}

export function combineQueryOptions<T>(findOptions: FindOptions<T>, queryOptions?: IQueryOptions): FindOptions<T> {
	let include = undefined;

	// findOptions "include" has precedence over queryOptions
	// - merge only when possible (when both are arrays)
	if (findOptions?.include) {
		if (!Array.isArray(findOptions.include)) {
			include = findOptions.include;
		} else {
			include = [
				...queryOptions?.include || [],
				...findOptions.include
			]
		}
	} else {
		include = [
			...queryOptions?.include || []
		];
	}

	return {
		...queryOptions,
		...findOptions,
		include: include
	}
}
