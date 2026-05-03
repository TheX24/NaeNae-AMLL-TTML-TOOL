import { 
	DismissRegular, 
	StarRegular, 
	FlashRegular, 
	Sparkle24Regular, 
	MusicNote1Regular, 
	SettingsRegular, 
	BoxRegular,
	TranslateRegular,
	RecordRegular
} from "@fluentui/react-icons";
import { Box, Button, Dialog, Flex, Heading, ScrollArea, Text, Card, Grid } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { whatsNewDialogAtom } from "$/states/dialogs.ts";
import { useTranslation } from "react-i18next";

export function WhatsNewDialog() {
	const [isOpen, setIsOpen] = useAtom(whatsNewDialogAtom);
	const { t } = useTranslation();

	const features = [
		{
			title: "Toxi Lyrics Engine",
			description: "High-fidelity jump-down animations, instant-on bloom with smooth fade-out, and adjustable wipe softness.",
			icon: <StarRegular />,
			color: "pink"
		},
		{
			title: "144Hz+ Rendering",
			description: "Dedicated interpolation engine for ultra-high refresh rates, bypassing React bottlenecks for butter-smooth lyrics.",
			icon: <FlashRegular />,
			color: "orange"
		},
		{
			title: "Cinematic Backgrounds",
			description: "Hardware-accelerated Mesh Gradient backgrounds running at 60 FPS for a premium, alive-feeling UI.",
			icon: <Sparkle24Regular />,
			color: "indigo"
		},
		{
			title: "Snap to Playhead",
			description: "One-click synchronization that snaps lyric start times directly to the audio playhead position.",
			icon: <RecordRegular />,
			color: "teal"
		},
		{
			title: "Advanced Phonetics",
			description: "Professional Mora-aware Japanese Romanization and capsule distribution system for perfect syllable syncing.",
			icon: <TranslateRegular />,
			color: "cyan"
		},
		{
			title: "Integrated Audio Bridge",
			description: "Built-in FFmpeg.wasm for high-fidelity MP3 to FLAC conversion to eliminate decoding drift.",
			icon: <MusicNote1Regular />,
			color: "blue"
		},
		{
			title: "Appearance Editor",
			description: "Over 40 granular visual parameters and theme presets to fully customize your editor's look.",
			icon: <SettingsRegular />,
			color: "ruby"
		},
		{
			title: "Community Plugin Store",
			description: "Integrated store to browse and install community-made WASM importers and exporters.",
			icon: <BoxRegular />,
			color: "gold"
		}
	];

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Content style={{ maxWidth: 700, height: "80vh", maxHeight: 700 }}>
				<Flex justify="between" align="center" mb="4">
					<Flex direction="column">
						<Dialog.Title mb="1">
							What's New in NaeNae's Fork
						</Dialog.Title>
						<Text size="2" color="gray">
							Key improvements over the base AMLL TTML TOOL by stevexmh
						</Text>
					</Flex>
					<Dialog.Close>
						<Button variant="ghost" color="gray">
							<DismissRegular />
						</Button>
					</Dialog.Close>
				</Flex>

				<ScrollArea type="always" scrollbars="vertical" style={{ height: "calc(100% - 80px)" }}>
					<Flex direction="column" gap="4" pr="4">
						<Card variant="surface" style={{ backgroundColor: "var(--accent-2)" }}>
							<Text size="2" style={{ fontStyle: "italic" }}>
								"This fork focuses on professional-grade performance, cinematic visual fidelity, and streamlined synchronization workflows that go beyond the original tool's scope."
							</Text>
						</Card>

						<Grid columns="2" gap="3">
							{features.map((f, i) => (
								<Card key={i} variant="classic" style={{ padding: "var(--space-3)" }}>
									<Flex direction="column" gap="2">
										<Flex align="center" gap="2">
											<Box style={{ color: `var(--${f.color}-11)` }}>
												{f.icon}
											</Box>
											<Heading size="3">{f.title}</Heading>
										</Flex>
										<Text size="2" color="gray">
											{f.description}
										</Text>
									</Flex>
								</Card>
							))}
						</Grid>

						<Box mt="2">
							<Heading size="3" mb="2">Other Enhancements</Heading>
							<Flex direction="column" gap="2">
								<Text size="2">• <strong>V-Sync & FPS Tools</strong>: Real-time performance monitoring.</Text>
								<Text size="2">• <strong>Smart BG Vocal Grouping</strong>: Unified scaling for main and background lines.</Text>
								<Text size="2">• <strong>Refined .ttml Writer</strong>: Optimized metadata handling and cleaner XML output.</Text>
								<Text size="2">• <strong>Modernized UI</strong>: Unified glassmorphism and improved layout stability.</Text>
							</Flex>
						</Box>
					</Flex>
				</ScrollArea>
			</Dialog.Content>
		</Dialog.Root>
	);
}
