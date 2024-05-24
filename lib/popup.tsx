import { WidgetProps } from '@/types/widget';

export interface PopUpWidgetCodeProps extends WidgetProps {
	username: string;
}
export function generatePopUpWidgetCode(props: PopUpWidgetCodeProps): string {
	return `<script
				src="https://cdn.statically.io/gh/shadow-wizards/static/main/bmz/widget.prod.js"
				data-name="BMZ-Widget"
				data-cfasync="false"
				data-id="${props.username}"
				data-description="${props.description ? encodeURI(props.description) : ''}"
				data-message="${props.message ? encodeURI(props.message) : ''}" 
				data-color="${props.color ? props.color : '#7C3BED'}"
				data-position="Right"
				data-x_margin="18"
				data-y_margin="18"
			></script>
        `;
}
