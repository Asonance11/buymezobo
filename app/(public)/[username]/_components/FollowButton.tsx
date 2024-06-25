import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FaHeart, FaHeartBroken, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { HTMLAttributes } from 'react';
import { cn } from '@/utility/style';

async function fetchFollowStatus(followingId: string) {
	const res = await axios.get(`/api/following?followingId=${followingId}`);
	if (res.status !== 200) {
		throw new Error('Error fetching follow status');
	}
	return res.data;
}

async function followUser(followingId: string) {
	const res = await fetch('/api/following', {
		method: 'POST',
		body: JSON.stringify({ followingId }),
		headers: { 'Content-Type': 'application/json' },
	});
	if (!res.ok) {
		throw new Error('Error following user');
	}
	return res.json();
}

async function unfollowUser(followingId: string) {
	const res = await fetch('/api/following', {
		method: 'DELETE',
		body: JSON.stringify({ followingId }),
		headers: { 'Content-Type': 'application/json' },
	});
	if (!res.ok) {
		throw new Error('Error unfollowing user');
	}
	return res.json();
}

interface Props extends HTMLAttributes<HTMLButtonElement> {
	followingId: string;
}

export function FollowButton({ followingId, className, ...opts }: Props) {
	const queryClient = useQueryClient();

	const { data, error, isLoading } = useQuery({
		queryKey: ['followStatus', followingId],
		queryFn: () => fetchFollowStatus(followingId),
	});

	const followMutation = useMutation({
		mutationFn: () => followUser(followingId),
		onMutate: () => {
			// Optimistically update UI to avoid flickering
			queryClient.setQueryData(['followStatus', followingId], { isFollowing: true });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['followStatus', followingId] });
		},
	});

	const unfollowMutation = useMutation({
		mutationFn: () => unfollowUser(followingId),
		onMutate: () => {
			// Optimistically update UI to avoid flickering
			queryClient.setQueryData(['followStatus', followingId], { isFollowing: false });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['followStatus', followingId] });
		},
	});

	const handleFollowToggle = () => {
		if (data.isFollowing) {
			unfollowMutation.mutate();
		} else {
			followMutation.mutate();
		}
	};

	if (isLoading) {
		return (
			<Button className="bg-purple-900 hover:bg-purple-800 text-white text-xs lg:text-sm" disabled>
				<FaSpinner className="mr-2 lg:h-4 lg:w-4 h-2.5 w-2.5 animate-spin" />
				Loading
			</Button>
		);
	}

	if (error) {
		return null;
	}

	return (
		<Button
			className={cn('bg-purple-900 text-white ', className)}
			onClick={handleFollowToggle}
			disabled={followMutation.isPending || unfollowMutation.isPending}
		>
			{data.isFollowing ? (
				<span className="inline-flex items-center ">
					<FaHeartBroken className="mr-2 lg:h-4 lg:w-4 h-2.5 w-2.5 " />
					Following
				</span>
			) : (
				<span className="inline-flex items-center ">
					<FaHeart className="mr-2 lg:h-4 lg:w-4 h-2.5 w-2.5 " />
					Follow
				</span>
			)}
		</Button>
	);
}
