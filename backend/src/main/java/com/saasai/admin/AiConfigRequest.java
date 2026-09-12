package com.saasai.admin;

public class AiConfigRequest {
    private String value;
    private String description;
    public String getValue(){return value;}
    public void setValue(String v){this.value=v;}
    public String getDescription(){return description;}
    public void setDescription(String d){this.description=d;}
}