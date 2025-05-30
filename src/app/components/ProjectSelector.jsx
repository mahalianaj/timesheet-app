'use client'
export default function ProjectSelector({selectedProject, setSelectedProject, 
                                         newProject, setNewProject,
                                        team, setTeam,
                                        projects}) {
    return (
        <div>
            <fieldset className="form-fieldset">
                    <legend className="form-text">Project</legend>
                <select 
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    required
                    className="form-select"
                    >
                        <option value="" disabled>--Choose a project--</option>
                        {projects.map((p) => (
                            <option key={p.Id} value={p.formatted_name}> 
                                {p.formatted_name}
                            </option>
                        ))}
                        <option value="custom">Add new project...</option>
                </select>
                {selectedProject === 'custom' && (
                    <div>
                        <div>
                            <input
                                type="text"
                                required
                                placeholder="Enter project's associated team"
                                onInvalid={(e) => e.target.setCustomValidity('Enter Team here')}
                                onInput={(e) => e.target.setCustomValidity('')}
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                required
                                placeholder="Enter new project name"
                                onInvalid={(e) => e.target.setCustomValidity('Enter Project here')}
                                onInput={(e) => e.target.setCustomValidity('')}
                                value={newProject}
                                onChange={(e) => setNewProject(e.target.value)}
                                className="form-input"
                            />
                        </div>
                    </div>
                )}
            </fieldset>
        </div>
    );
}