# Data Access

```typescript
@Module({
  imports: [
    HttpModule,
    RulesModule,
    RunnableModule,
    GitModule,
    DataAccessModule,
  ],
  controllers: [AppController],
  providers: [
    ScheduleService,
    {
      provide: 'DataAccessInterface',
      useClass: DatabaseAccess, // drop default configuration
    },
  ],
})
```
