import { View } from "react-native";

import { BLOB_LAYERS } from "@/constants";

interface Props {
	color: string;
	radius: number;
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
}

export function Blob({ color, radius, top, bottom, left, right }: Props) {
	const size = radius * 2;
	return (
		<View
			pointerEvents="none"
			style={{
				position: "absolute",
				top,
				bottom,
				left,
				right,
				width: size,
				height: size,
				alignItems: "center",
				justifyContent: "center",
			}}>
			{BLOB_LAYERS.map(({ factor, opacity }, i) => {
				const r = radius * factor;
				return (
					<View
						key={i}
						style={{
							position: "absolute",
							width: r * 2,
							height: r * 2,
							borderRadius: r,
							backgroundColor: color,
							opacity,
						}}
					/>
				);
			})}
		</View>
	);
}
