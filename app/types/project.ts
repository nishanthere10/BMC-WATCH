export type ProjectType = "Road Work" | "Drain Work" | "Water Line Repair"
export type ProjectStatus = "Planned" | "In Progress" | "Delayed" | "Completed"

export interface ProjectUpdate {
    date:string;
    text:string;

}

export interface Project {
    id:string, 
    slug:string,
    title:string,
    type:ProjectType;
    ward:string,
    location:string,
    latitude:number,
    longitude:number;
    contractorName:string,
    contractorPhone:string,
    budgetSanctioned:number,
    budgetSpent:number,
    completionPercent:number,
    status:ProjectStatus;
    startDate:string,
    expectedCompletionDate:string,
    description:string,
    images:string[];
    updates:ProjectUpdate[];
}