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
export function formatProjectData(projects: any[]) {
    const rows: any[] = [];
    projects.forEach((project) => {
        project.project_detail &&
            project.project_detail.length > 0 &&
            project.project_detail.forEach((item: any) => {
                item.detail_info &&
                    item.detail_info.length > 0 &&
                    item.detail_info.forEach((file: any, fileIndex: number) => {
                        rows.push({
                            project: {
                                id: project.id,
                                name: project.evaluate_project_name,
                                rowSpan: 0, // 后面填
                            }, // 项目相关数据
                            assess: {
                                id: item.id,
                                name: item.evaluate_detail_name,
                                gist: item.evaluate_points,
                                rowSpan: 0, // 后面填
                            }, // 评估项数据
                            gist: {
                                id: file.id,
                                index: fileIndex + 1,
                                name: file.content,
                                flag: file.flag,
                            }, // 评估要点数据
                        });
                    });
            });
    });

    // === 处理 project 合并行 ===
    let projectIndex = 0;
    for (const project of projects) {
        if (!project.project_detail || project.project_detail.length === 0) continue;
        const totalFiles = project.project_detail!.reduce(
            (sum: number, item: any) => sum + item.detail_info.length,
            0
        );
        rows[projectIndex].project.rowSpan = totalFiles;
        projectIndex += totalFiles;
    }

    // === 处理 assessItem 合并行 ===
    let idx = 0;
    for (const project of projects) {
        if (!project.project_detail) continue;
        for (const item of project.project_detail!) {
            const len = item.detail_info.length;
            rows[idx]!.assess.rowSpan = len;
            idx += len;
        }
    }

    return rows;
}
