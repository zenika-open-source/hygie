# Data Access

If you wanna use our Data Access interface to manage your data storage, it's quiet easy!

You just need to implement the `DataAccessInterface` (located in `src/data_access/`).
Actually, there's two implementations: a file storage (`fileAccess.ts`) and a Mongodb storage (`databaseAccess.ts`).

By default, it uses the second one. If you want to store all your data in the file system, just set the `DATA_ACCESS` env var to `file`.

Once you've created your own implementation, you juste need to overwrite the `src/app.module.ts` file this way:

```typescript
@Module({
  imports: [
    HttpModule,
    RulesModule.forRoot(YourOwnDataAccess), // Use the YourOwnDataAccess instead
    RunnableModule,
    GitModule,
  ],
  controllers: [AppController],
  providers: [ScheduleService],
})
export class AppModule {}
```
