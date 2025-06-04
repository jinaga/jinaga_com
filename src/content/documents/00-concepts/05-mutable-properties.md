---
title: "Mutable Properties"
---

Facts are immutable.
So you don't want to put a property like `name` in a project.
You would never be able to change it!

Instead, you can define a successor that represents changing the project name.
This is the pattern we use.

```csharp
[FactType("Construction.Project.Name")]
public record ProjectName(Project project, string value, ProjectName[] prior);
```

That `prior` array let's you overwrite a prior value.
The first value will have an empty array, which means there is no prior value.

```csharp
ProjectName projectAName1 = await j.Fact(new ProjectName(projectA, "Cheyenne Expansion", []));
```

```dot
digraph {
    rankdir=BT
    node [shape=none]
    "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Jinaga.User</TD></TR><TR><TD>publicKey</TD><TD>--- TEST USER ---</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project</TD></TR><TR><TD>id</TD><TD>52eb9df8-7b1c-43d4-9...</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" -> "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=" creator"]
    "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Cheyenne Expansion</TD></TR></TABLE>>]
    "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
}
```

To change the name, you create a new fact that has the old name as its prior value.

```csharp
ProjectName projectAName2 = await j.Fact(new ProjectName(projectA, "Rivercrest Expansion", [projectAName1]));
```

```dot
digraph {
    rankdir=BT
    node [shape=none]
    "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Jinaga.User</TD></TR><TR><TD>publicKey</TD><TD>--- TEST USER ---</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project</TD></TR><TR><TD>id</TD><TD>52eb9df8-7b1c-43d4-9...</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" -> "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=" creator"]
    "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Cheyenne Expansion</TD></TR></TABLE>>]
    "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
    "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Rivercrest Expansion</TD></TR></TABLE>>]
    "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
    "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" -> "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" [label=" prior"]
}
```

To query for the current name, you look for a successor that does not appear in any list of `prior` values.

```csharp
var namesOfProject = Given<Project>.Match(p =>
    p.Successors().OfType<ProjectName>(n => n.project)
        .Where(p => !p.Successors().OfType<ProjectName>(next => next.prior).Any())
);

ImmutableList<ProjectName> names = await j.Query(namesOfProject, projectA);

names.Select(n => n.value)
```

```
[ "Rivercrest Expansion" ]
```

Jinaga provides a shorthand for this pattern as well.

```csharp
var namesOfProject = Given<Project>.Match(p =>
    p.Successors().OfType<ProjectName>(n => n.project)
        .WhereCurrent((ProjectName next) => next.prior)
);
```

## Concurrent Edits

The reason that we use the `prior` array is to handle concurrent edits.
If a user on a different device changes the name of the project, you will get a fork in the graph.

```csharp
ProjectName projectAName3 = await j.Fact(new ProjectName(projectA, "Cheyenne Remodel", [projectAName1]));
```

S

```dot
digraph {
    rankdir=BT
    node [shape=none]
    "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Jinaga.User</TD></TR><TR><TD>publicKey</TD><TD>--- TEST USER ---</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project</TD></TR><TR><TD>id</TD><TD>52eb9df8-7b1c-43d4-9...</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" -> "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=" creator"]
    "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Cheyenne Expansion</TD></TR></TABLE>>]
    "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
    "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Rivercrest Expansion</TD></TR></TABLE>>]
    "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
    "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" -> "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" [label=" prior"]
    "vGnXSLjOADIAr0eVBXktKVUElG/uFuumiUBtyRlJZO8ixenhcTySa9U+fJLMTkp3yFB2u28i6s0fA1yi2dAf5g==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Cheyenne Remodel</TD></TR></TABLE>>]
    "vGnXSLjOADIAr0eVBXktKVUElG/uFuumiUBtyRlJZO8ixenhcTySa9U+fJLMTkp3yFB2u28i6s0fA1yi2dAf5g==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
    "vGnXSLjOADIAr0eVBXktKVUElG/uFuumiUBtyRlJZO8ixenhcTySa9U+fJLMTkp3yFB2u28i6s0fA1yi2dAf5g==" -> "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" [label=" prior"]
}
```

That will result in more than one successor matching the specification.

```csharp
ImmutableList<ProjectName> names = await j.Query(namesOfProject, projectA);

names.Select(n => n.value)
```

```
[ "Rivercrest Expansion", "Cheyenne Remodel" ]
```

This is how you can recognize that there have been concurrent edits.
It also shows you the candidate values for the project name.

To merge, identify the correct value.
Then create a new fact that sets the correct value and has all candidates in its `prior` array.

```csharp
ProjectName projectAName4 = await j.Fact(new ProjectName(projectA, "Rivercrest Remodel", names.ToArray()));
```

```dot
digraph {
    rankdir=BT
    node [shape=none]
    "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Jinaga.User</TD></TR><TR><TD>publicKey</TD><TD>--- TEST USER ---</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project</TD></TR><TR><TD>id</TD><TD>52eb9df8-7b1c-43d4-9...</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" -> "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=" creator"]
    "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Cheyenne Expansion</TD></TR></TABLE>>]
    "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
    "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Rivercrest Expansion</TD></TR></TABLE>>]
    "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
    "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" -> "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" [label=" prior"]
    "vGnXSLjOADIAr0eVBXktKVUElG/uFuumiUBtyRlJZO8ixenhcTySa9U+fJLMTkp3yFB2u28i6s0fA1yi2dAf5g==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Cheyenne Remodel</TD></TR></TABLE>>]
    "vGnXSLjOADIAr0eVBXktKVUElG/uFuumiUBtyRlJZO8ixenhcTySa9U+fJLMTkp3yFB2u28i6s0fA1yi2dAf5g==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
    "vGnXSLjOADIAr0eVBXktKVUElG/uFuumiUBtyRlJZO8ixenhcTySa9U+fJLMTkp3yFB2u28i6s0fA1yi2dAf5g==" -> "RDT0fLC2Ht6/7ioD2jy9UkRQHU7YB8KjuhXMtW2p77stVVubhV6mw5rdytlr6xRuh2dxeaYviDEZYU4bXwcukg==" [label=" prior"]
    "ML0Nc5M+KYIkky8t/IVjQ/BRaZm8IZGnkxQClMvsChIQsRgfHui79tE5a+fPnpX1ch8N0Yhd/6MW9eTZLfaFOg==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project.Name</TD></TR><TR><TD>value</TD><TD>Rivercrest Remodel</TD></TR></TABLE>>]
    "ML0Nc5M+KYIkky8t/IVjQ/BRaZm8IZGnkxQClMvsChIQsRgfHui79tE5a+fPnpX1ch8N0Yhd/6MW9eTZLfaFOg==" -> "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=" project"]
    "ML0Nc5M+KYIkky8t/IVjQ/BRaZm8IZGnkxQClMvsChIQsRgfHui79tE5a+fPnpX1ch8N0Yhd/6MW9eTZLfaFOg==" -> "uECG/V1c641/SNfINkMRif0QPIQIoVcf0Qo7hWBpsG51BSX9SefJC1e7wbGg+/zcDQGxiw76bepnRcnL5TDifg==" [label=" prior"]
    "ML0Nc5M+KYIkky8t/IVjQ/BRaZm8IZGnkxQClMvsChIQsRgfHui79tE5a+fPnpX1ch8N0Yhd/6MW9eTZLfaFOg==" -> "vGnXSLjOADIAr0eVBXktKVUElG/uFuumiUBtyRlJZO8ixenhcTySa9U+fJLMTkp3yFB2u28i6s0fA1yi2dAf5g==" [label=" prior"]
}
```

And now only one successor matches the specification.

```csharp
ImmutableList<ProjectName> names = await j.Query(namesOfProject, projectA);

names.Select(n => n.value)
```

```
[ "Rivercrest Remodel" ]
```