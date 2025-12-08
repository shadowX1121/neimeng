// 过滤掉对象中的 undefined 值
export function removeUndefined(obj: any) {
    if (!obj || typeof obj !== "object") return obj;
    for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
            delete obj[key];
        } else if (typeof obj[key] === "object") {
            removeUndefined(obj[key]); // 递归处理
        }
    }
    return obj;
}
// 扁平化评估项目数据
export function formatProjectData(projects: AssessProjectType[]) {
    const rows: AssessProjectStructType[] = [];
    projects.forEach((project) => {
        project.assessItem!.forEach((item) => {
            item.file.forEach((file, _fileIndex) => {
                rows.push({
                    id: `${project.id}-${item.id}-${file.id}`,
                    projectName: project.name,
                    projectRowSpan: 0, // 后面填
                    assessName: item.name,
                    assessRowSpan: 0, // 后面填
                    gist: item.gist,
                    fileName: file.name,
                    fileUrl: file.fileUrl,
                    isBase: file.isBase,
                });
            });
        });
    });

    // === 处理 project 合并行 ===
    let projectIndex = 0;
    for (const project of projects) {
        const totalFiles = project.assessItem!.reduce(
            (sum, item) => sum + item.file.length,
            0
        );
        rows[projectIndex]!.projectRowSpan = totalFiles;
        projectIndex += totalFiles;
    }

    // === 处理 assessItem 合并行 ===
    let idx = 0;
    for (const project of projects) {
        for (const item of project.assessItem!) {
            const len = item.file.length;
            rows[idx]!.assessRowSpan = len;
            idx += len;
        }
    }

    return rows;
}
