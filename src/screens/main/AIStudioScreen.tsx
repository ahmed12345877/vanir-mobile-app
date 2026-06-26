import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import {
  generateStudioCampaignCopy,
  generateStudioImageConcepts,
  getStudioBrandKits,
  getStudioTemplates,
  type BrandKit,
  type CampaignCopyResult,
  type ImageConcept,
  type StudioTemplate,
} from '../../services/aiStudio';
import { colors } from '../../theme/colors';

const tools = [
  { id: 'image', title: 'Image Generation', stat: '50K+ generated', body: 'Create stunning travel photos and artwork with AI-powered generation tools.' },
  { id: 'video', title: 'Video Creation', stat: 'Coming soon', body: 'Generate engaging cinematic video content for travel marketing.' },
  { id: 'blueprints', title: 'Blueprints', stat: '120+ templates', body: 'Pre-built design templates for instant creative inspiration.' },
  { id: 'upscale', title: 'AI Upscaler', stat: '4x resolution', body: 'Enhance image quality up to 4x resolution with intelligent upscaling.' },
  { id: 'canvas', title: 'Canvas Editor', stat: 'Pro tools', body: 'Professional editing tools for fine-tuning your AI creations.' },
  { id: 'flow', title: 'Flow State', stat: 'Automation', body: 'Automated creative workflows for batch content generation.' },
  { id: 'social', title: 'Social Ad Creator', stat: 'Campaign ready', body: 'Generate ad creatives, landing visuals, and story formats for paid social campaigns.' },
  { id: 'copy', title: 'Caption & Copy AI', stat: 'Multilingual', body: 'Create English and Arabic campaign copy, captions, hooks, and launch messages.' },
  { id: 'voice', title: 'Voiceover Studio', stat: 'Brand narration', body: 'Draft premium voiceover scripts and audio-ready scene directions for travel promos.' },
  { id: 'brand', title: 'Brand Kit AI', stat: 'Luxury presets', body: 'Keep campaigns on-brand with reusable luxury travel visual directions, palettes, and templates.' },
  { id: 'retouch', title: 'Restoration & Retouch', stat: 'Detail control', body: 'Repair, clean, sharpen, and retouch destination imagery before publishing.' },
  { id: 'localize', title: 'Localization AI', stat: 'Global markets', body: 'Adapt visuals and messaging for international markets without losing the VANIR identity.' },
];

const servicePillars = [
  {
    title: 'Creative Generation',
    body: 'Images, video concepts, storyboards, moodframes, and campaign art direction from a single prompt-to-output workflow.',
  },
  {
    title: 'Marketing Intelligence',
    body: 'Ad copy, destination promos, offer creatives, multilingual campaigns, and social content generation for conversion-led growth.',
  },
  {
    title: 'Production Acceleration',
    body: 'Upscaling, retouching, canvas editing, brand presets, and reusable blueprints to move from idea to publish faster.',
  },
  {
    title: 'Enterprise Workflow',
    body: 'Batch workflows, creative approvals, asset consistency, and multi-market localization for premium travel teams.',
  },
];

const galleryItems = [
  { id: 'all-1', title: 'Egyptian Elegance', category: 'Fashion', likes: '2.8K', imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/1000146353_e679aa8f.jpg' },
  { id: 'all-2', title: 'Pharaonic Majesty', category: 'Historical', likes: '3.1K', imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/1000146347_c499649b.jpg' },
  { id: 'all-3', title: 'Nile Cruise Luxury', category: 'Travel', likes: '2.4K', imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/1000141933_d6652362.jpg' },
  { id: 'all-4', title: 'Pyramid Majesty', category: 'Landmarks', likes: '3.8K', imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/1000146383_c6931189.jpg' },
];

const filters = ['All', 'Fashion', 'Historical', 'Travel', 'Landmarks'] as const;
const studioModes = ['Generate Image', 'Prompt Templates', 'Campaign Copy', 'Brand Kits'] as const;

export function AIStudioScreen() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');
  const [activeMode, setActiveMode] = useState<(typeof studioModes)[number]>('Generate Image');
  const [promptInput, setPromptInput] = useState('Create a luxury campaign visual for VANIR AI Studio featuring premium travel, cinematic light, and strong brand prestige.');
  const [campaignBrief, setCampaignBrief] = useState('AI Studio launch for luxury travel services');
  const [campaignAudience, setCampaignAudience] = useState('Affluent travelers in the Gulf and MENA');
  const [selectedKitId, setSelectedKitId] = useState('');
  const [promptTemplates, setPromptTemplates] = useState<StudioTemplate[]>([]);
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [imageConcepts, setImageConcepts] = useState<ImageConcept[]>([]);
  const [copyResults, setCopyResults] = useState<CampaignCopyResult[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  const visibleItems = useMemo(() => {
    if (activeFilter === 'All') {
      return galleryItems;
    }

    return galleryItems.filter(item => item.category === activeFilter);
  }, [activeFilter]);

  const activeKit = brandKits.find(kit => kit.id === selectedKitId) ?? brandKits[0];

  useEffect(() => {
    let cancelled = false;

    async function bootstrapStudio() {
      try {
        setIsBootstrapping(true);
        const [templates, kits] = await Promise.all([getStudioTemplates(), getStudioBrandKits()]);
        if (cancelled) {
          return;
        }

        setPromptTemplates(templates);
        setBrandKits(kits);
        setSelectedKitId(current => current || kits[1]?.id || kits[0]?.id || '');
      } catch (error) {
        if (!cancelled) {
          Alert.alert('AI Studio unavailable', error instanceof Error ? error.message : 'Please try again.');
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrapStudio();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGenerateImageConcepts() {
    if (!promptInput.trim()) {
      Alert.alert('Prompt required', 'Write the image direction first.');
      return;
    }

    try {
      setIsGeneratingImage(true);
      const concepts = await generateStudioImageConcepts({
        prompt: promptInput.trim(),
        brandKitId: activeKit?.id,
      });
      setImageConcepts(concepts);
    } catch (error) {
      Alert.alert('Generation failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  }

  function applyTemplate(template: StudioTemplate) {
    setPromptInput(template.prompt);
    setActiveMode('Generate Image');
  }

  async function handleGenerateCampaignCopy() {
    if (!campaignBrief.trim()) {
      Alert.alert('Campaign brief required', 'Add the campaign offer or concept first.');
      return;
    }

    try {
      setIsGeneratingCopy(true);
      const results = await generateStudioCampaignCopy({
        brief: campaignBrief.trim(),
        audience: campaignAudience.trim() || 'premium travelers',
        brandKitId: activeKit?.id,
      });
      setCopyResults(results);
    } catch (error) {
      Alert.alert('Copy generation failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsGeneratingCopy(false);
    }
  }

  return (
    <Screen
      title="AI Studio"
      subtitle="Create extraordinary visual experiences with premium AI tools, stronger art direction, and executable in-app workflows.">
      <SectionCard>
        <Text style={screenStyles.label}>Powered by advanced AI</Text>
        <Text style={styles.heroTitle}>Create Extraordinary Visual Experiences</Text>
        <Text style={screenStyles.body}>
          Transform your imagination into stunning visuals with AI-powered creative tools designed for the world of luxury travel.
        </Text>
        <Image source={{ uri: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/egypt-pyramids-hero-iqbfDkZV4VwqjH9bTnSoDx.webp' }} style={styles.heroImage} />
        <View style={styles.statsRow}>
          <Stat value="50K+" label="Images Created" />
          <Stat value="12K+" label="Active Users" />
          <Stat value="5" label="AI Models" />
        </View>
        {isBootstrapping ? <Text style={styles.bootstrappingText}>Syncing AI Studio services…</Text> : null}
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Executable AI Workflows</Text>
        <Text style={screenStyles.body}>These tools work directly inside the app now: prompt drafting, image concept generation, campaign copy output, and reusable brand kits.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeRow}>
          {studioModes.map(mode => (
            <Pressable key={mode} style={[styles.modeChip, activeMode === mode && styles.modeChipActive]} onPress={() => setActiveMode(mode)}>
              <Text style={[styles.modeChipText, activeMode === mode && styles.modeChipTextActive]}>{mode}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.workbench}>
          <Text style={styles.workbenchTitle}>{activeMode}</Text>

          {activeMode === 'Generate Image' ? (
            <>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={promptInput}
                onChangeText={setPromptInput}
                placeholder="Describe the visual you want to generate"
                placeholderTextColor={colors.textMuted}
                multiline
              />
              <Pressable style={styles.primaryButton} onPress={handleGenerateImageConcepts} disabled={isGeneratingImage || isBootstrapping}>
                <Text style={styles.primaryButtonText}>{isGeneratingImage ? 'Generating...' : 'Generate concepts'}</Text>
              </Pressable>
              <View style={styles.resultList}>
                {imageConcepts.map(concept => (
                  <View key={concept.title} style={styles.resultCard}>
                    <Text style={styles.resultLabel}>{concept.style}</Text>
                    <Text style={styles.resultTitle}>{concept.title}</Text>
                    <Text style={styles.resultBody}>{concept.body}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {activeMode === 'Prompt Templates' ? (
            <View style={styles.resultList}>
              {promptTemplates.map(template => (
                <Pressable key={template.id} style={styles.templateCard} onPress={() => applyTemplate(template)}>
                  <Text style={styles.resultTitle}>{template.title}</Text>
                  <Text style={styles.resultBody}>{template.prompt}</Text>
                  <Text style={styles.templateAction}>Use in generator</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {activeMode === 'Campaign Copy' ? (
            <>
              <TextInput
                style={styles.input}
                value={campaignBrief}
                onChangeText={setCampaignBrief}
                placeholder="Campaign brief"
                placeholderTextColor={colors.textMuted}
              />
              <TextInput
                style={styles.input}
                value={campaignAudience}
                onChangeText={setCampaignAudience}
                placeholder="Audience"
                placeholderTextColor={colors.textMuted}
              />
              <Pressable style={styles.primaryButton} onPress={handleGenerateCampaignCopy} disabled={isGeneratingCopy || isBootstrapping}>
                <Text style={styles.primaryButtonText}>{isGeneratingCopy ? 'Generating...' : 'Generate copy'}</Text>
              </Pressable>
              <View style={styles.resultList}>
                {copyResults.map(result => (
                  <View key={result.language} style={styles.resultCard}>
                    <Text style={styles.resultLabel}>{result.language}</Text>
                    <Text style={styles.resultTitle}>{result.hook}</Text>
                    <Text style={styles.resultBody}>{result.body}</Text>
                    <Text style={styles.resultCta}>{result.cta}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {activeMode === 'Brand Kits' ? (
            <View style={styles.resultList}>
              {brandKits.map(kit => (
                <Pressable key={kit.id} style={[styles.kitCard, selectedKitId === kit.id && styles.kitCardActive]} onPress={() => setSelectedKitId(kit.id)}>
                  <Text style={styles.resultTitle}>{kit.title}</Text>
                  <Text style={styles.resultBody}>Palette: {kit.palette}</Text>
                  <Text style={styles.resultBody}>Tone: {kit.tone}</Text>
                  <Text style={styles.templateAction}>{kit.usage}</Text>
                </Pressable>
              ))}
              <View style={styles.activeKitCard}>
                <Text style={styles.resultLabel}>Active kit</Text>
                <Text style={styles.resultTitle}>{activeKit.title}</Text>
                <Text style={styles.resultBody}>{activeKit.palette}</Text>
                <Text style={styles.resultBody}>{activeKit.tone}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Creative Studio</Text>
        <Text style={screenStyles.body}>A suite of intelligent tools designed to bring your travel vision to life.</Text>
        <View style={styles.toolsGrid}>
          {tools.map(tool => (
            <View key={tool.id} style={styles.toolCard}>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolStat}>{tool.stat}</Text>
              <Text style={styles.toolBody}>{tool.body}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>AI Service Pillars</Text>
        <Text style={screenStyles.body}>This is the direction required to compete with global AI creative platforms: broader services, faster output, and stronger operational depth.</Text>
        <View style={styles.pillarList}>
          {servicePillars.map(pillar => (
            <View key={pillar.title} style={styles.pillarCard}>
              <Text style={styles.pillarTitle}>{pillar.title}</Text>
              <Text style={styles.pillarBody}>{pillar.body}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Featured Gallery</Text>
        <Text style={screenStyles.body}>Explore AI-generated artwork inspired by Egypt's timeless beauty and rich heritage.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {filters.map(filter => (
            <Pressable
              key={filter}
              style={[styles.filterChip, filter === activeFilter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}>
              <Text style={[styles.filterText, filter === activeFilter && styles.filterTextActive]}>{filter}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.galleryGrid}>
          {visibleItems.map(item => (
            <View key={item.id} style={styles.galleryCard}>
              <Image source={{ uri: item.imageUrl }} style={styles.galleryImage} />
              <View style={styles.galleryBody}>
                <Text style={screenStyles.label}>{item.category}</Text>
                <Text style={styles.galleryTitle}>{item.title}</Text>
                <Text style={styles.galleryMeta}>{item.likes} likes</Text>
              </View>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>How It Works</Text>
        <View style={styles.stepsList}>
          <Step number="01" title="Describe" body="Enter a detailed description of the image or video you want to create." />
          <Step number="02" title="Generate" body="Our AI processes your prompt and generates high-quality visual content." />
          <Step number="03" title="Refine" body="Fine-tune your creation with editing tools and style adjustments." />
          <Step number="04" title="Export" body="Download your creation in high resolution, ready for any platform." />
        </View>
      </SectionCard>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <View style={styles.stepCard}>
      <Text style={styles.stepNumber}>{number}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  statValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  bootstrappingText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  modeRow: {
    gap: 8,
    paddingRight: 10,
  },
  modeChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeChipText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  modeChipTextActive: {
    color: colors.background,
  },
  workbench: {
    gap: 12,
  },
  workbenchTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.background,
    fontWeight: '800',
  },
  resultList: {
    gap: 10,
  },
  resultCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
  },
  resultLabel: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '800',
  },
  resultTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  resultBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  resultCta: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  templateCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  templateAction: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  kitCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
  },
  kitCardActive: {
    borderColor: colors.primary,
  },
  activeKitCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 14,
    gap: 6,
  },
  toolsGrid: {
    gap: 10,
  },
  toolCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
  },
  toolTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  toolStat: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '700',
  },
  toolBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  pillarList: {
    gap: 10,
  },
  pillarCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
  },
  pillarTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  pillarBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  filtersRow: {
    gap: 8,
    paddingRight: 10,
  },
  filterChip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextActive: {
    color: colors.background,
  },
  galleryGrid: {
    gap: 12,
  },
  galleryCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  galleryImage: {
    width: '100%',
    height: 200,
  },
  galleryBody: {
    padding: 14,
    gap: 4,
  },
  galleryTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  galleryMeta: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '700',
  },
  stepsList: {
    gap: 10,
  },
  stepCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 4,
  },
  stepNumber: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  stepTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  stepBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});