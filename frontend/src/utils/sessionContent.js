const formatFileSize = (bytes) => {
  if (!bytes || Number.isNaN(Number(bytes))) return '';
  const value = Number(bytes);
  if (value === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(value) / Math.log(k));
  return `${parseFloat((value / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const determineContentType = ({ name = '', type = '', fallback }) => {
  const lowerName = name.toLowerCase();
  const lowerType = (type || '').toLowerCase();
  const fallbackType = (fallback || '').toLowerCase();

  if (fallbackType === 'video' || lowerType.includes('video') || /\.(mp4|mov|wmv|avi|mkv)$/i.test(lowerName)) {
    return 'video';
  }
  if (
    fallbackType === 'presentation' ||
    lowerType.includes('presentation') ||
    /\.(ppt|pptx|key)$/i.test(lowerName)
  ) {
    return 'presentation';
  }
  if (
    fallbackType === 'document' ||
    lowerType.includes('word') ||
    lowerType.includes('document') ||
    /\.(doc|docx|pdf|txt)$/i.test(lowerName)
  ) {
    return 'document';
  }
  if (fallbackType === 'ai') {
    return 'ai';
  }
  if (fallbackType === 'assessment') {
    return 'assessment';
  }
  return 'file';
};

const normalizeFileEntry = (file) => {
  if (!file) return null;
  if (typeof file === 'string') {
    return {
      id: file,
      name: file,
      type: '',
      size: 0,
      uploadedAt: null,
      dataUrl: null,
    };
  }
  return {
    id: file.id || `${file.name || 'resource'}-${file.size || 0}-${file.uploadedAt || file.lastModified || ''}`,
    name: file.name || file.filename || 'Resource',
    type: file.type || file.mimeType || '',
    size: file.size || file.fileSize || 0,
    uploadedAt: file.uploadedAt || file.lastModified || null,
    dataUrl: file.dataUrl || null,
  };
};

const uniqueByKey = (items, getKey) => {
  const map = new Map();
  items.forEach((item) => {
    if (!item) return;
    const key = getKey(item);
    const normalizedItem = { ...item };
    if (!map.has(key)) {
      map.set(key, normalizedItem);
      return;
    }

    const existing = map.get(key);
    const merged = {
      ...existing,
      ...normalizedItem,
      dataUrl: normalizedItem.dataUrl || existing.dataUrl || normalizedItem.url || existing.url || null,
      url: normalizedItem.url || existing.url || null,
      downloadUrl: normalizedItem.downloadUrl || existing.downloadUrl || null,
      link: normalizedItem.link || existing.link || null,
    };

    map.set(key, merged);
  });
  return Array.from(map.values());
};

export const buildSessionContentItems = (session) => {
  if (!session) return [];

  const items = [];
  let counter = 0;

  const creationMode =
    session.creationMode ||
    session.creation_mode ||
    session.resumeState?.selectedCreationMode ||
    session.resumeState?.creationMode;

  if (creationMode) {
    const creationLabels = {
      powerpoint: 'PowerPoint Presentation',
      presentation: 'Presentation',
      word: 'Word Document',
      document: 'Document',
      video: 'Training Video',
    };
    const normalizedType = determineContentType({
      fallback: creationMode,
    });
    items.push({
      id: `creation-${counter++}`,
      type: normalizedType,
      title: creationLabels[creationMode] || 'Created Content',
      description: creationLabels[creationMode]
        ? `Generated via ${creationLabels[creationMode]} mode`
        : 'Generated session content',
      meta: session.creationMode ? 'Uploaded by admin' : undefined,
      downloadable: false,
      completed: Boolean(session.completed),
    });
  }

  const aiKeywords =
    session.aiContent?.keywords ||
    session.resumeState?.aiKeywords ||
    session.resumeState?.aiContent?.keywords;
  const aiGenerated =
    session.aiContent ||
    session.resumeState?.aiContentGenerated ||
    session.resumeState?.aiContent;

  if (aiGenerated) {
    const aiContent = aiGenerated.content || session.resumeState?.aiContent?.content || '';
    const aiTitle = aiGenerated.title || 'AI Generated Content';
    items.push({
      id: `ai-${counter++}`,
      type: 'ai',
      title: aiTitle || 'AI Generated Content',
      description: aiKeywords ? `Keywords: ${aiKeywords}` : 'AI generated learning material',
      meta: aiGenerated.generatedAt ? `Generated ${new Date(aiGenerated.generatedAt).toLocaleDateString()}` : undefined,
      downloadable: false,
      completed: Boolean(session.completed),
      aiContent: aiContent, // Store full content for PDF generation
      aiTitle: aiTitle,
      aiKeywords: aiKeywords
    });
  }

  const fileCandidates = [
    ...(Array.isArray(session.files) ? session.files : []),
    ...(Array.isArray(session.resumeState?.selectedFiles) ? session.resumeState.selectedFiles : []),
    ...(Array.isArray(session.resumeState?.files) ? session.resumeState.files : []),
  ]
    .map(normalizeFileEntry)
    .filter(Boolean);

  const uniqueFiles = uniqueByKey(
    fileCandidates,
    (file) => `${file.id || file.name}-${file.size}-${file.type}`
  );

  uniqueFiles.forEach((file, index) => {
    const resolvedDataUrl = file.dataUrl || file.url || file.downloadUrl || file.link || null;
    const contentType = determineContentType({ name: file.name, type: file.type });
    items.push({
      id: file.id || `file-${counter++}-${index}`,
      type: contentType,
      title: file.name || `File ${index + 1}`,
      description: file.size ? formatFileSize(file.size) : file.type || 'Uploaded resource',
      meta: file.uploadedAt ? `Uploaded ${new Date(file.uploadedAt).toLocaleDateString()}` : undefined,
      downloadable: true,
      completed: Boolean(session.completed),
      dataUrl: resolvedDataUrl,
      downloadUrl: file.downloadUrl || file.url || file.link || null,
    });
  });

  const quiz = session.quiz || null;
  const questionCount =
    quiz?.questions?.length ||
    session.questions?.length ||
    session.assessmentInfo?.questionsCount ||
    0;
  const assessmentTitle =
    quiz?.title ||
    session.assessmentInfo?.quizTitle ||
    quiz?.name ||
    'Checkpoint Assessment';
  const passingScore =
    quiz?.assessmentInfo?.passingScore ||
    session.assessmentInfo?.passingScore;

  if (quiz || questionCount > 0 || session.assessmentInfo) {
    items.push({
      id: `assessment-${counter++}`,
      type: 'assessment',
      title: assessmentTitle,
      description: questionCount
        ? `${questionCount} question${questionCount === 1 ? '' : 's'}`
        : 'Assessment available',
      meta:
        typeof passingScore === 'number'
          ? `Passing Score: ${passingScore}%`
          : undefined,
      downloadable: false,
      completed: Boolean(session.completed),
    });
  }

  if (!items.length) {
    items.push({
      id: 'placeholder-content',
      type: 'info',
      title: 'Session content not available yet',
      description: 'Uploaded materials will appear here once added.',
      downloadable: false,
      completed: Boolean(session.completed),
    });
  }

  return items;
};

export { formatFileSize };

