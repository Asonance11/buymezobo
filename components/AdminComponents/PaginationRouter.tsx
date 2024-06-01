import { PaginationMeta } from '@/types/pagination-meta.interface';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';
import { uuid } from 'uuidv4';

export default function PaginationRouter({ meta }: { meta: PaginationMeta }) {
	const items = new Array(Math.ceil(meta.totalCount / meta.pageSize));
	return (
		<Pagination className=" absolute bottom-8">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href={`?page=${meta.page - 1}`} disabled={meta.page <= 1} />
				</PaginationItem>
				{items.map((_, index) => (
					<PaginationItem key={uuid()}>
						<PaginationLink href={`?page=${index + 1}`}>{index + 1}</PaginationLink>
					</PaginationItem>
				))}
				<PaginationItem>
					<PaginationNext
						href={`?page=${meta.page + 1}`}
						disabled={meta.page * meta.pageSize >= meta.totalCount}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
